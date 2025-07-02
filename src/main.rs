use anyhow::Result;
use axum::{response::Redirect, routing::get, Extension, Router};
use std::net::SocketAddr;
use tower_http::trace::TraceLayer;
use tracing_subscriber;

mod config;
mod database;
mod enums;
mod models;
mod router;

#[tokio::main]
async fn main() -> Result<()> {
    tracing_subscriber::fmt::init();

    let config = config::AppConfig::load()?;
    let db = database::setup::init(&config.database).await?;

    let app = Router::new()
        .route("/", get(|| async { Redirect::permanent("/web/") }))
        .nest("/api", router::api_routes())
        .nest("/web", router::web_routes())
        .layer(TraceLayer::new_for_http())
        .layer(Extension(db))
        .layer(Extension(config.clone()));

    let addr = SocketAddr::from(([0, 0, 0, 0], config.server.port));
    tracing::info!("Listening on http://{}", addr);

    axum_server::bind(addr)
        .serve(app.into_make_service())
        .await?;

    Ok(())
}