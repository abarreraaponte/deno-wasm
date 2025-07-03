// src/core/database/setup.rs
use crate::config::DatabaseConfig;
use anyhow::Result;
use sqlx::{Pool, Postgres};
use sqlx::postgres::PgPoolOptions;

pub async fn init(config: &DatabaseConfig) -> Result<Pool<Postgres>> {
    tracing::info!("Connecting to database at {}", config.url);
    let pool = PgPoolOptions::new()
		.max_connections(config.pool_max_size)
		.connect(&config.url)
		.await?;
    tracing::info!("Connected to database.");

    tracing::info!("Running migrations...");
    sqlx::migrate!("./src/database/migrations")
        .run(&pool)
        .await
        .map_err(|e| anyhow::anyhow!("Failed to run migrations: {}", e))?;
    tracing::info!("Migrations completed successfully.");

    Ok(pool)
}
