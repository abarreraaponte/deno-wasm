use anyhow::Result;
use axum::{Extension, Router};
use std::net::SocketAddr;
use tower_http::trace::TraceLayer;
use tracing_subscriber;

mod core;

#[tokio::main]
async fn main() -> Result<()> {
    tracing_subscriber::fmt::init();

    let config = core::config::AppConfig::load()?;
    let pool = core::database::setup::init(&config.database).await?;

    let app = Router::new()
        .merge(core::router::routes())
        .layer(TraceLayer::new_for_http())
        .layer(Extension(pool))
        .layer(Extension(config.clone()));

    let addr = SocketAddr::from(([0, 0, 0, 0], config.server.port));
    tracing::info!("Listening on {}", addr);
    axum_server::bind(addr)
        .serve(app.into_make_service())
        .await?;

    Ok(())
}
