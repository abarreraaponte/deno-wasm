use axum::{Router, response::IntoResponse, routing::get};

async fn health_check() -> impl IntoResponse {
    "OK"
}

pub fn api_routes() -> Router {
    Router::new().route("/health", get(health_check))
}
