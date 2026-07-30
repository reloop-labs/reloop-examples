defmodule ElixirApp.Router do
  use Plug.Router

  plug :match
  plug Plug.Parsers, parsers: [:json], json_decoder: Jason
  plug :dispatch

  post "/api/api-keys" do
    ElixirApp.ApiKeysController.create(conn)
  end

  get "/api/api-keys" do
    conn = fetch_query_params(conn)
    ElixirApp.ApiKeysController.list(conn)
  end

  get "/api/api-keys/:id" do
    ElixirApp.ApiKeysController.get(conn, id)
  end

  patch "/api/api-keys/:id" do
    ElixirApp.ApiKeysController.update(conn, id)
  end

  post "/api/api-keys/:id/disable" do
    ElixirApp.ApiKeysController.disable(conn, id)
  end

  post "/api/api-keys/:id/enable" do
    ElixirApp.ApiKeysController.enable(conn, id)
  end

  post "/api/api-keys/:id/rotate" do
    ElixirApp.ApiKeysController.rotate(conn, id)
  end

  delete "/api/api-keys/:id" do
    ElixirApp.ApiKeysController.delete(conn, id)
  end

  match _ do
    send_resp(conn, 404, "Not Found")
  end
end
