use serde::{Serialize, Deserialize};
use sqlx::types::{Decimal};
use uuid::Uuid;

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
pub struct ConversionRate {
    pub id: Uuid,
    pub from_unit_id: Uuid,
    pub to_unit_id: Uuid,
    pub rate: Decimal,
}