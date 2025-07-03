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

pub fn web_routes() -> Router {
    Router::new()
        .route("/", get(serve_index))
        .route("/{*path}", get(serve_static_asset))
}

async fn serve_index() -> impl IntoResponse {
    serve_static_asset(Path("index.html".to_string())).await
}

async fn serve_static_asset(Path(path): Path<String>) -> impl IntoResponse {
    match Assets::get(&path) {
        Some(content) => {
            let mime = mime_guess::from_path(&path).first_or_octet_stream();
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
                    .body(Body::from("404 Not Found"))
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