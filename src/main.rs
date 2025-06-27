use anyhow::Result;
use axum::{Extension, Router};
use std::net::SocketAddr;
use tower_http::trace::TraceLayer;
use tracing_subscriber;

mod models;
mod config;
mod database;
mod router;

#[tokio::main]
async fn main() -> Result<()> {
    tracing_subscriber::fmt::init();

    let config = config::AppConfig::load()?;
    let db = database::setup::init(&config.database).await?;

    let app = Router::new()
        .nest("/api", router::api_routes())
        .nest("/web", router::web_routes())
        .layer(TraceLayer::new_for_http())
        .layer(Extension(db))
        .layer(Extension(config.clone()));

    let addr = SocketAddr::from(([0, 0, 0, 0], config.server.port));
    tracing::info!("Listening on {}", addr);
    axum_server::bind(addr)
        .serve(app.into_make_service())
        .await?;

    Ok(())
}
