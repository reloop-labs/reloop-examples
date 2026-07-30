defmodule ElixirApp.Application do
  use Application

  @impl true
  def start(_type, _args) do
    if File.exists?(".env") do
      DotenvParser.load_file(".env")
    end

    children = [
      {Plug.Cowboy, scheme: :http, plug: ElixirApp.Router, options: [port: 8080]}
    ]

    opts = [strategy: :one_for_one, name: ElixirApp.Supervisor]
    IO.puts("🚀 Alex's Elixir Web Server running on http://localhost:8080")
    Supervisor.start_link(children, opts)
  end
end
