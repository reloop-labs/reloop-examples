import sh.reloop.ReloopClient;
import sh.reloop.models.Models.*;

import java.util.Map;

public class ApiKeysController {
    private final ReloopClient client;

    public ApiKeysController(String apiKey) {
        this.client = new ReloopClient(apiKey);
    }

    // 1. POST /api/api-keys - Create API Key
    public ApiKeyWithKey create(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Name is required");
        }
        CreateApiKeyParams params = new CreateApiKeyParams(name, true, true);
        return client.apiKeys.create(params);
    }

    // 2. GET /api/api-keys - List API Keys
    public ApiKeyListResponse list(Integer limit, Integer page) {
        int l = limit != null ? limit : 10;
        int p = page != null ? page : 1;
        ApiKeyListParams params = new ApiKeyListParams(p, l, null, null, null);
        return client.apiKeys.list(params);
    }

    // 3. GET /api/api-keys/{id} - Get API Key Details
    public ApiKey get(String id) {
        return client.apiKeys.get(id);
    }

    // 4. PATCH /api/api-keys/{id} - Update / Rename API Key
    public ApiKey update(String id, String newName) {
        if (newName == null || newName.trim().isEmpty()) {
            throw new IllegalArgumentException("Name is required");
        }
        UpdateApiKeyParams params = new UpdateApiKeyParams(newName, true); 
        return client.apiKeys.update(id, params);
    }


    // 5. POST /api/api-keys/{id}/disable - Disable API Key
    public ApiKey disable(String id) {
        return client.apiKeys.disable(id);
    }

    // 6. POST /api/api-keys/{id}/enable - Enable API Key
    public ApiKey enable(String id) {
        return client.apiKeys.enable(id);
    }

    // 7. POST /api/api-keys/{id}/rotate - Rotate API Key Secret
    public ApiKeyWithKey rotate(String id) {
        return client.apiKeys.rotate(id);
    }

    // 8. DELETE /api/api-keys/{id} - Delete API Key
    public DeleteApiKeyResponse delete(String id) {
        return client.apiKeys.delete(id);
    }
}
