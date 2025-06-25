// src/core/database/setup.rs
use crate::core::config::DatabaseConfig;
use anyhow::Result;
use sqlx::{PgPool, Pool, Postgres};

pub async fn init(config: &DatabaseConfig) -> Result<Pool<Postgres>> {
    tracing::info!("Connecting to database at {}", config.url);
    let pool = PgPool::connect(&config.url).await?;
    tracing::info!("Connected to database.");

    tracing::info!("Running migrations...");
    sqlx::migrate!("./src/core/database/migrations")
        .run(&pool)
        .await
        .map_err(|e| anyhow::anyhow!("Failed to run migrations: {}", e))?;
    tracing::info!("Migrations completed successfully.");

    Ok(pool)
}
