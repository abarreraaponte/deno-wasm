use anyhow::{Result, anyhow};
use dotenvy::dotenv;
use serde::Deserialize;
use std::env; // You'll also need std::env::VarError if you want to handle specific error types

#[derive(Debug, Deserialize, Clone)]
pub struct ServerConfig {
    pub port: u16,
}

#[derive(Debug, Deserialize, Clone)]
pub struct DatabaseConfig {
    pub url: String,
}

// Define the enum for EnvironmentMode, directly representing "dev" or "prod"
#[derive(Debug, Deserialize, Clone, PartialEq)]
pub enum EnvironmentMode {
    #[serde(rename = "dev")]
    Development,
    #[serde(rename = "prod")]
    Production,
}

// Default value for EnvironmentMode
impl Default for EnvironmentMode {
    fn default() -> Self {
        EnvironmentMode::Development // Default to "dev"
    }
}

// EnvironmentConfig struct using the enum
#[derive(Debug, Deserialize, Clone)]
pub struct EnvironmentConfig {
    pub mode: EnvironmentMode,
}

#[derive(Debug, Deserialize, Clone)]
pub struct AppConfig {
    pub server: ServerConfig,
    pub database: DatabaseConfig,
    pub environment: EnvironmentConfig,
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
        let database_config = DatabaseConfig { url: database_url };

        // --- Correct way to get and parse KL_ENV_MODE ---
        let environment_mode_result = env::var("KL_ENV_MODE");

        let environment_mode = match environment_mode_result {
            Ok(mode_str) => {
                match mode_str.as_str() {
                    "dev" => EnvironmentMode::Development,
                    "prod" => EnvironmentMode::Production,
                    _ => return Err(anyhow!("Invalid KL_ENV_MODE: '{}'. Must be 'dev' or 'prod'.", mode_str)),
                }
            },
            Err(e) => {
                // If KL_ENV_MODE is not set, use the default.
                // You could also return an error here if you want KL_ENV_MODE to be mandatory.
                tracing::warn!("KL_ENV_MODE not set, defaulting to 'dev'. Error: {}", e);
                EnvironmentMode::default()
            }
        };

        let environment_config = EnvironmentConfig { mode: environment_mode };
        // --- End of correct way ---


        Ok(AppConfig {
            server: server_config,
            database: database_config,
            environment: environment_config,
        })
    }
}