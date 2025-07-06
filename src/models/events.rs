use chrono::{DateTime, Utc, NaiveDate};
use serde::{Serialize, Deserialize};
use sqlx::types::{Decimal, Json};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Event {
    pub id: Uuid,
    pub parent_id: Option<Uuid>,
    pub event_type: String,
    pub payload: Option<Json<serde_json::Value>>,
    pub created_at: Option<DateTime<Utc>>,
}


#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Entry {
    pub id: Uuid,
    pub transaction_id: Uuid,
    pub ledger_id: Uuid,
	pub event_id: Uuid,
    pub debit_account_id: Uuid,
    pub credit_account_id: Uuid,
    pub unit_id: Uuid,
    pub value: Decimal,
	pub date: NaiveDate,
}