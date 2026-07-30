mod controllers;

use axum::{
    routing::{get, post},
    Router,
};
use controllers::api_keys::*;
use dotenvy::dotenv;
use reloop_email::ReloopClient;
use std::{env, net::SocketAddr, sync::Arc};

#[tokio::main]
async fn main() {
    dotenv().ok();

    let api_key = env::var("RELOOP_API_KEY")
        .unwrap_or_else(|_| "rl_prod_MfCFoT2Q25weJ9t2yjZvrG5TNW8".to_string());

    let client = Arc::new(ReloopClient::new(api_key, None));

    let app = Router::new()
        .route("/api/api-keys", post(create_key).get(list_keys))
        .route(
            "/api/api-keys/:id",
            get(get_key).patch(update_key).delete(delete_key),
        )
        .route("/api/api-keys/:id/disable", post(disable_key))
        .route("/api/api-keys/:id/enable", post(enable_key))
        .route("/api/api-keys/:id/rotate", post(rotate_key))
        .with_state(client);

    let addr = SocketAddr::from(([0, 0, 0, 0], 8080));
    println!("🚀 Alex's Rust Web Server running on http://localhost:8080");

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}
