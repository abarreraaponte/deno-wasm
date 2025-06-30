use axum::{
    body::Body,
    extract::Path,
    http::{header, StatusCode},
    response::{IntoResponse, Response},
    routing::get,
    Json, Router,
};
use rust_embed::RustEmbed;
use serde_json::{json, Value};

#[derive(RustEmbed)]
#[folder = "dist/web/"]
struct Assets;

// This function now defines all routes under /web
pub fn web_routes() -> Router {
    Router::new()
        // Route for the root of /web/
        .route("/", get(static_path_handler_for_root))
        // Route for all other paths under /web/ using the correct wildcard syntax
        .route("/{*path}", get(static_path_handler))
}

// A small wrapper for the root route to provide an empty path
async fn static_path_handler_for_root() -> impl IntoResponse {
    static_path_handler(Path("".to_string())).await
}

async fn static_path_handler(Path(path): Path<String>) -> impl IntoResponse {
    let path = path.trim_start_matches('/');

    let effective_path = if path.is_empty() {
        "index.html"
    } else {
        path
    };

    match Assets::get(effective_path) {
        Some(content) => {
            let mime = mime_guess::from_path(effective_path).first_or_octet_stream();
            Response::builder()
                .header(header::CONTENT_TYPE, mime.as_ref())
                .body(Body::from(content.data))
                .unwrap()
        }
        None => {
            if let Some(content) = Assets::get("index.html") {
                Response::builder()
                    .header(header::CONTENT_TYPE, "text/html")
                    .body(Body::from(content.data))
                    .unwrap()
            } else {
                Response::builder()
                    .status(StatusCode::NOT_FOUND)
                    .body(Body::from("404: index.html not found"))
                    .unwrap()
            }
        }
    }
}

pub fn api_routes() -> Router {
    Router::new()
        .route("/health", get(health_check))
        .route("/test-json", get(test_json_handler))
}

async fn test_json_handler() -> Json<Value> {
    Json(json!({ "count": 88, "status": "ok" }))
}

async fn health_check() -> impl IntoResponse {
    "OK"
}