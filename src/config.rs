use anyhow::{Result, anyhow};
use dotenvy::dotenv;
use serde::Deserialize;
use std::env;

#[derive(Debug, Deserialize, Clone)]
pub struct ServerConfig {
    pub port: u16,
}

#[derive(Debug, Deserialize, Clone)]
pub struct DatabaseConfig {
    pub url: String,
	pub pool_max_size: u32,
}

#[derive(Debug, Deserialize, Clone)]
pub struct AppConfig {
    pub server: ServerConfig,
    pub database: DatabaseConfig,
}

impl AppConfig {
    pub fn load() -> Result<Self> {
        dotenv().ok();

        let server_port = env::var("KL_SERVER_PORT")
            .unwrap_or_else(|_| "8000".to_string())
            .parse()
            .map_err(|e| anyhow!("Invalid KL_SERVER_PORT: {}", e))?;
        let server_config = ServerConfig { port: server_port };

        let database_url =
            env::var("KL_DATABASE_URL").map_err(|e| anyhow!("KL_DATABASE_URL not set: {}", e))?;
		let database_pool_max_size: u32 = env::var("KL_DATABASE_POOL_MAX_SIZE")
			.ok()
			.and_then(|s| s.parse().ok())
			.unwrap_or_else(|| {
				println!("⚠️ Warning: KL_DATABASE_POOL_MAX_SIZE not set or invalid. Defaulting to 10.");
				10
			});

        let database_config = DatabaseConfig { url: database_url, pool_max_size: database_pool_max_size };


        Ok(AppConfig {
            server: server_config,
            database: database_config
        })
    }
}