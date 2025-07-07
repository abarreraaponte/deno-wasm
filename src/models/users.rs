use chrono::{DateTime, Utc};
use serde::{Serialize, Deserialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct User {
    pub id: Uuid,
    pub first_name: String,
	pub last_name: String,
	pub email: String,
	pub password_hash: String,
	pub created_at: DateTime<Utc>,
	pub updated_at: DateTime<Utc>,
}