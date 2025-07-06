use serde::{Serialize, Deserialize};
use sqlx::types::{Json};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct TransactionModel {
    pub id: Uuid,
    pub ref_id: String,
    pub alt_id: Option<String>,
    pub name: String,
    pub active: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Transaction {
    pub id: Uuid,
    pub event_id: Uuid,
    pub transaction_model_id: Uuid,
    pub ref_id: String,
    pub alt_id: Option<String>,
    pub meta: Option<Json<serde_json::Value>>,
}