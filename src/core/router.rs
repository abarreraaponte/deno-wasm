use crate::core::api::controllers;
use axum::Router;

pub fn routes() -> Router {
    Router::new().nest("/api", controllers::api_routes())
}
