use axum::{routing::get, Router};
use std::net::SocketAddr;
use tower_http::trace::TraceLayer;
use tracing_subscriber;
use dotenvy::dotenv;
use sqlx::PgPool;

async fn hellow_world() -> &'static str {
	"Hello, World!"
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
	tracing_subscriber::fmt::init();

	dotenv().ok();

	let database_url = std::env::var("DATABASE_URL")
		.expect("DATABASE_URL must be set.");

	let pool =PgPool::connect(&database_url).await?;
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

	let addr = SocketAddr::from(([0,0,0,0], 3000));
	tracing::info!("Listening on {}", addr);
	axum_server::bind(addr)
		.serve(app.into_make_service())
		.await?;

	Ok(())
}
