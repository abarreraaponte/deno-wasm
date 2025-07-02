use super::enums::{BalanceType, EventStatus, ModuleType};
use chrono::{DateTime, Utc};
use serde::{Serialize, Deserialize};
use sqlx::types::{Decimal, Json};
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
pub struct TransactionModel {
    pub id: Uuid,
    pub ref_id: String,
    pub alt_id: Option<String>,
    pub name: String,
    pub active: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct UnitType {
    pub id: Uuid,
    pub ref_id: String,
    pub alt_id: Option<String>,
    pub name: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Unit {
    pub id: Uuid,
    pub ref_id: String,
    pub alt_id: Option<String>,
    pub unit_type_id: Uuid,
    pub name: String,
    pub symbol: Option<String>,
    pub precision: Option<i32>,
    pub decimal_separator: String,
    pub thousands_separator: String,
    pub active: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Flow {
    pub id: Uuid,
    pub name: String,
    pub triggering_event_type: String,
    pub active: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct FlowStep {
    pub id: Uuid,
    pub flow_id: Uuid,
    pub step_order: i32,
    pub step_type: String,
    pub module_type: Option<ModuleType>,
    pub location_uri: Option<String>,
    pub description: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Event {
    pub id: Uuid,
    pub correlation_id: Uuid,
    pub causation_id: Option<Uuid>,
    pub event_type: String,
    pub payload: Option<Json<serde_json::Value>>,
    pub status: Option<EventStatus>,
    pub created_at: Option<DateTime<Utc>>,
    pub processing_flow_id: Option<Uuid>,
    pub processing_flow_step_id: Option<Uuid>,
}

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
pub struct Transaction {
    pub id: Uuid,
    pub event_id: Uuid,
    pub transaction_model_id: Uuid,
    pub ref_id: String,
    pub alt_id: Option<String>,
    pub meta: Option<Json<serde_json::Value>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Entry {
    pub id: Uuid,
    pub transaction_id: Uuid,
    pub ledger_id: Uuid,
    pub debit_account_id: Uuid,
    pub credit_account_id: Uuid,
    pub unit_id: Uuid,
    pub value: Option<Decimal>,
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

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Dimension {
    pub id: Uuid,
    pub entry_id: Uuid,
    pub entity_model_id: Option<Uuid>,
    pub entity_id: Uuid,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct ConversionRate {
    pub id: Uuid,
    pub from_unit_id: Uuid,
    pub to_unit_id: Uuid,
    pub rate: Decimal,
}