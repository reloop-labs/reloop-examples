require "dotenv/load"
require "sinatra/base"
require "json"
require "reloop"
require_relative "controllers/api_keys"

class App < Sinatra::Base
  set :port, 8080
  set :bind, "0.0.0.0"

  def initialize
    super
    api_key = ENV["RELOOP_API_KEY"] || "rl_prod_MfCFoT2Q25weJ9t2yjZvrG5TNW8"
    reloop_client = Reloop::Client.new(api_key: api_key)
    @controller = Controllers::ApiKeys.new(reloop_client)
  end

  before do
    content_type :json
  end

  def parse_body
    request.body.rewind
    body_text = request.body.read
    return {} if body_text.empty?
    JSON.parse(body_text)
  rescue JSON::ParserError
    {}
  end

  # 1. Create Key
  post "/api/api-keys" do
    res = @controller.create(parse_body)
    status res[:status]
    res[:body].to_json
  end

  # 2. List Keys
  get "/api/api-keys" do
    res = @controller.list(params)
    status res[:status]
    res[:body].to_json
  end

  # 3. Get Key Details
  get "/api/api-keys/:id" do
    res = @controller.get(params[:id])
    status res[:status]
    res[:body].to_json
  end

  # 4. Update / Rename Key
  patch "/api/api-keys/:id" do
    res = @controller.update(params[:id], parse_body)
    status res[:status]
    res[:body].to_json
  end

  # 5. Disable Key
  post "/api/api-keys/:id/disable" do
    res = @controller.disable(params[:id])
    status res[:status]
    res[:body].to_json
  end

  # 6. Enable Key
  post "/api/api-keys/:id/enable" do
    res = @controller.enable(params[:id])
    status res[:status]
    res[:body].to_json
  end

  # 7. Rotate Key Secret
  post "/api/api-keys/:id/rotate" do
    res = @controller.rotate(params[:id])
    status res[:status]
    res[:body].to_json
  end

  # 8. Delete Key
  delete "/api/api-keys/:id" do
    res = @controller.delete(params[:id])
    status res[:status]
    res[:body].to_json
  end

  error do
    status 500
    { success: false, error: env['sinatra.error'].message }.to_json
  end
end

App.run! if __FILE__ == $0
