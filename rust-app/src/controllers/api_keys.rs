use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use reloop_email::{models::*, ReloopClient};
use serde::Deserialize;
use serde_json::json;
use std::sync::Arc;

#[derive(Deserialize)]
pub struct CreateKeyPayload {
    pub name: String,
}

#[derive(Deserialize)]
pub struct UpdateKeyPayload {
    pub name: String,
}

#[derive(Deserialize)]
pub struct PaginationQuery {
    pub page: Option<i32>,
    pub limit: Option<i32>,
}

// 1. POST /api/api-keys - Create API Key
pub async fn create_key(
    State(client): State<Arc<ReloopClient>>,
    Json(payload): Json<CreateKeyPayload>,
) -> impl IntoResponse {
    let params = CreateApiKeyParams {
        name: payload.name,
        enabled: Some(true),
        rate_limit_enabled: Some(true),
    };

    match client.api_keys().create(params).await {
        Ok(result) => (
            StatusCode::CREATED,
            Json(json!({ "success": true, "data": result })),
        ),
        Err(err) => (
            StatusCode::BAD_REQUEST,
            Json(json!({ "success": false, "error": err.to_string() })),
        ),
    }
}

// 2. GET /api/api-keys - List API Keys
pub async fn list_keys(
    State(client): State<Arc<ReloopClient>>,
    Query(query): Query<PaginationQuery>,
) -> impl IntoResponse {
    let params = ApiKeyListParams {
        page: query.page.or(Some(1)),
        limit: query.limit.or(Some(10)),
        ..Default::default()
    };

    match client.api_keys().list(Some(params)).await {
        Ok(result) => (
            StatusCode::OK,
            Json(json!({ "success": true, "data": result })),
        ),
        Err(err) => (
            StatusCode::BAD_REQUEST,
            Json(json!({ "success": false, "error": err.to_string() })),
        ),
    }
}

// 3. GET /api/api-keys/:id - Get Key Details
pub async fn get_key(
    State(client): State<Arc<ReloopClient>>,
    Path(id): Path<String>,
) -> impl IntoResponse {
    match client.api_keys().get(&id).await {
        Ok(result) => (
            StatusCode::OK,
            Json(json!({ "success": true, "data": result })),
        ),
        Err(err) => (
            StatusCode::BAD_REQUEST,
            Json(json!({ "success": false, "error": err.to_string() })),
        ),
    }
}

// 4. PATCH /api/api-keys/:id - Update / Rename Key
pub async fn update_key(
    State(client): State<Arc<ReloopClient>>,
    Path(id): Path<String>,
    Json(payload): Json<UpdateKeyPayload>,
) -> impl IntoResponse {
    let params = UpdateApiKeyParams {
        name: Some(payload.name),
        enabled: Some(true),
    };

    match client.api_keys().update(&id, params).await {
        Ok(result) => (
            StatusCode::OK,
            Json(json!({ "success": true, "data": result })),
        ),
        Err(err) => (
            StatusCode::BAD_REQUEST,
            Json(json!({ "success": false, "error": err.to_string() })),
        ),
    }
}

// 5. POST /api/api-keys/:id/disable - Disable Key
pub async fn disable_key(
    State(client): State<Arc<ReloopClient>>,
    Path(id): Path<String>,
) -> impl IntoResponse {
    match client.api_keys().disable(&id).await {
        Ok(result) => (
            StatusCode::OK,
            Json(json!({ "success": true, "data": result })),
        ),
        Err(err) => (
            StatusCode::BAD_REQUEST,
            Json(json!({ "success": false, "error": err.to_string() })),
        ),
    }
}

// 6. POST /api/api-keys/:id/enable - Enable Key
pub async fn enable_key(
    State(client): State<Arc<ReloopClient>>,
    Path(id): Path<String>,
) -> impl IntoResponse {
    match client.api_keys().enable(&id).await {
        Ok(result) => (
            StatusCode::OK,
            Json(json!({ "success": true, "data": result })),
        ),
        Err(err) => (
            StatusCode::BAD_REQUEST,
            Json(json!({ "success": false, "error": err.to_string() })),
        ),
    }
}

// 7. POST /api/api-keys/:id/rotate - Rotate Key Secret
pub async fn rotate_key(
    State(client): State<Arc<ReloopClient>>,
    Path(id): Path<String>,
) -> impl IntoResponse {
    match client.api_keys().rotate(&id).await {
        Ok(result) => (
            StatusCode::OK,
            Json(json!({ "success": true, "data": result })),
        ),
        Err(err) => (
            StatusCode::BAD_REQUEST,
            Json(json!({ "success": false, "error": err.to_string() })),
        ),
    }
}

// 8. DELETE /api/api-keys/:id - Delete Key
pub async fn delete_key(
    State(client): State<Arc<ReloopClient>>,
    Path(id): Path<String>,
) -> impl IntoResponse {
    match client.api_keys().delete(&id).await {
        Ok(result) => (
            StatusCode::OK,
            Json(json!({ "success": true, "data": result })),
        ),
        Err(err) => (
            StatusCode::BAD_REQUEST,
            Json(json!({ "success": false, "error": err.to_string() })),
        ),
    }
}
