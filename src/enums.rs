use sqlx::Type;
use serde::{Serialize, Deserialize};

#[derive(Debug, Clone, PartialEq, Eq, Type, Serialize, Deserialize)]
#[sqlx(type_name = "balance_type", rename_all = "lowercase")]
pub enum BalanceType {
    Debit,
    Credit,
}