module Controllers
  class ApiKeys
    def initialize(reloop_client)
      @client = reloop_client
    end

    # 1. POST /api/api-keys - Create API Key
    def create(body)
      name = body["name"]
      raise ArgumentError, "Name is required" if name.nil? || name.strip.empty?

      result = @client.api_keys.create({ name: name })
      { status: 201, body: { success: true, data: result } }
    end

    # 2. GET /api/api-keys - List API Keys
    def list(params)
      limit = (params["limit"] || 10).to_i
      page = (params["page"] || 1).to_i

      result = @client.api_keys.list({ limit: limit, page: page })
      { status: 200, body: { success: true, data: result } }
    end

    # 3. GET /api/api-keys/:id - Get Key Details
    def get(id)
      result = @client.api_keys.get(id)
      { status: 200, body: { success: true, data: result } }
    end

    # 4. PATCH /api/api-keys/:id - Update / Rename Key
    def update(id, body)
      name = body["name"]
      raise ArgumentError, "Name is required" if name.nil? || name.strip.empty?

      result = @client.api_keys.update(id, { name: name })
      { status: 200, body: { success: true, data: result } }
    end

    # 5. POST /api/api-keys/:id/disable - Disable Key
    def disable(id)
      result = @client.api_keys.disable(id)
      { status: 200, body: { success: true, data: result } }
    end

    # 6. POST /api/api-keys/:id/enable - Enable Key
    def enable(id)
      result = @client.api_keys.enable(id)
      { status: 200, body: { success: true, data: result } }
    end

    # 7. POST /api/api-keys/:id/rotate - Rotate Key Secret
    def rotate(id)
      result = @client.api_keys.rotate(id)
      { status: 200, body: { success: true, data: result } }
    end

    # 8. DELETE /api/api-keys/:id - Delete Key
    def delete(id)
      result = @client.api_keys.delete(id)
      { status: 200, body: { success: true, data: result } }
    end
  end
end
