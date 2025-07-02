use sqlx::Type;
use serde::{Serialize, Deserialize};

#[derive(Debug, Clone, PartialEq, Eq, Type, Serialize, Deserialize)]
#[sqlx(type_name = "balance_type", rename_all = "lowercase")]
pub enum BalanceType {
    Debit,
    Credit,
}

#[derive(Debug, Clone, PartialEq, Eq, Type, Serialize, Deserialize)]
#[sqlx(type_name = "event_status", rename_all = "lowercase")]
pub enum EventStatus {
    Pending,
    Processed,
    Failed,
}

#[derive(Debug, Clone, PartialEq, Eq, Type, Serialize, Deserialize)]
#[sqlx(type_name = "module_type", rename_all = "UPPERCASE")]
pub enum ModuleType {
    Wasm,
    Native,
}