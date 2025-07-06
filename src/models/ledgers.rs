use crate::enums::{BalanceType};
use serde::{Serialize, Deserialize};
use sqlx::types::{Json};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Ledger {
    pub id: Uuid,
    pub ref_id: String,
    pub alt_id: Option<String>,
    pub name: String,
    pub description: Option<String>,
    pub unit_type_id: Option<Uuid>,
    pub active: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Account {
    pub id: Uuid,
    pub ref_id: String,
    pub alt_id: Option<String>,
    pub balance_type: Option<BalanceType>,
    pub ledger_id: Uuid,
    pub parent_id: Option<Uuid>,
    pub name: String,
    pub meta: Option<Json<serde_json::Value>>,
    pub active: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Dimension {
    pub id: Uuid,
    pub entry_id: Uuid,
    pub entity_model_id: Option<Uuid>,
    pub entity_id: Uuid,
}