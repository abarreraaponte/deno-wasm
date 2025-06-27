use axum::{Router, response::IntoResponse, routing::get};

async fn app() -> impl IntoResponse {
    "OK"
}

async fn health_check() -> impl IntoResponse {
    "OK"
}

pub fn web_routes() -> Router {
    Router::new().route("/", get(app))
}

pub fn api_routes() -> Router {
    Router::new().route("/health", get(health_check))
}