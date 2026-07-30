defmodule ElixirApp.ApiKeysController do
  import Plug.Conn
  alias Reloop.Services.ApiKey

  defp parse_json(conn) do
    {:ok, body, conn} = read_body(conn)
    case Jason.decode(body) do
      {:ok, json} -> {json, conn}
      _ -> {%{}, conn}
    end
  end

  def get_client do
    api_key = System.get_env("RELOOP_API_KEY") || "rl_prod_S1P7dA_7zHsfSxaFNM3gv5tGchg"
    Reloop.Client.new(api_key)
  end

  def send_json(conn, status, data) do
    conn
    |> put_resp_content_type("application/json")
    |> send_resp(status, Jason.encode!(data))
  end

  # 1. POST /api/api-keys - Create API Key
  def create(conn) do
    {body, conn} = parse_json(conn)
    name = Map.get(body, "name", "Elixir Modular Key")
    client = get_client()

    case ApiKey.create(client, %{name: name, enabled: true}) do
      {:ok, result} -> send_json(conn, 201, %{success: true, data: result})
      {:error, err} -> send_json(conn, 400, %{success: false, error: err})
    end
  end

  # 2. GET /api/api-keys - List API Keys
  def list(conn) do
    params = conn.query_params
    page = String.to_integer(Map.get(params, "page", "1"))
    limit = String.to_integer(Map.get(params, "limit", "10"))
    client = get_client()

    case ApiKey.list(client, %{page: page, limit: limit}) do
      {:ok, result} -> send_json(conn, 200, %{success: true, data: result})
      {:error, err} -> send_json(conn, 400, %{success: false, error: err})
    end
  end

  # 3. GET /api/api-keys/:id - Get Key Details
  def get(conn, id) do
    client = get_client()

    case ApiKey.get(client, id) do
      {:ok, result} -> send_json(conn, 200, %{success: true, data: result})
      {:error, err} -> send_json(conn, 400, %{success: false, error: err})
    end
  end

  # 4. PATCH /api/api-keys/:id - Update / Rename Key
  def update(conn, id) do
    {body, conn} = parse_json(conn)
    name = Map.get(body, "name", "Renamed via Elixir Server")
    client = get_client()

    case ApiKey.update(client, id, %{name: name}) do
      {:ok, result} -> send_json(conn, 200, %{success: true, data: result})
      {:error, err} -> send_json(conn, 400, %{success: false, error: err})
    end
  end

  # 5. POST /api/api-keys/:id/disable - Disable Key
  def disable(conn, id) do
    client = get_client()

    case ApiKey.disable(client, id) do
      {:ok, result} -> send_json(conn, 200, %{success: true, data: result})
      {:error, err} -> send_json(conn, 400, %{success: false, error: err})
    end
  end

  # 6. POST /api/api-keys/:id/enable - Enable Key
  def enable(conn, id) do
    client = get_client()

    case ApiKey.enable(client, id) do
      {:ok, result} -> send_json(conn, 200, %{success: true, data: result})
      {:error, err} -> send_json(conn, 400, %{success: false, error: err})
    end
  end

  # 7. POST /api/api-keys/:id/rotate - Rotate Key Secret
  def rotate(conn, id) do
    client = get_client()

    case ApiKey.rotate(client, id) do
      {:ok, result} -> send_json(conn, 200, %{success: true, data: result})
      {:error, err} -> send_json(conn, 400, %{success: false, error: err})
    end
  end

  # 8. DELETE /api/api-keys/:id - Delete Key
  def delete(conn, id) do
    client = get_client()

    case ApiKey.delete(client, id) do
      {:ok, result} -> send_json(conn, 200, %{success: true, data: result})
      {:error, err} -> send_json(conn, 400, %{success: false, error: err})
    end
  end
end
