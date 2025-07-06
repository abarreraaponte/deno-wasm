use serde::{Serialize, Deserialize};
use sqlx::types::{Json};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct EntityModel {
    pub id: Uuid,
    pub ref_id: String,
    pub alt_id: Option<String>,
    pub name: String,
    pub active: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Entity {
    pub id: Uuid,
    pub entity_model_id: Uuid,
    pub parent_id: Option<Uuid>,
    pub ref_id: String,
    pub alt_id: Option<String>,
    pub name: String,
    pub meta: Option<Json<serde_json::Value>>,
}