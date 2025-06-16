use axum::{Router, routing::get};
use dotenvy::dotenv;
use sqlx::PgPool;
use std::net::SocketAddr;
use tower_http::trace::TraceLayer;
use tracing_subscriber;

async fn hellow_world() -> &'static str {
    "Hello, World!"
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::fmt::init();

    dotenv().ok();

    let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set.");
    let server_port: u16 = std::env::var("SERVER_PORT").unwrap_or_else(|_| "8000".to_string()).parse().expect("SERVER_PORT must be a valid u16");

    let pool = PgPool::connect(&database_url).await?;
    tracing::info!("Connected to database at {}", database_url);

    // Run migrations automatically on startup.
    tracing::info!("Running migrations...");
    sqlx::migrate!("./migrations")
        .run(&pool)
        .await
        .map_err(|e| anyhow::anyhow!("Failed to run migrations: {}", e))?;
    tracing::info!("Migrations completed successfully.");

    let app = Router::new()
        .route("/", get(hellow_world))
        .layer(TraceLayer::new_for_http());

    let addr = SocketAddr::from(([0, 0, 0, 0], server_port));
    tracing::info!("Listening on {}", addr);
    axum_server::bind(addr)
        .serve(app.into_make_service())
        .await?;

    Ok(())
}
