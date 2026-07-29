<?php

namespace AlexApp;

use Reloop\Reloop;

class ApiKeysController
{
    private Reloop $reloop;

    public function __construct()
    {
        $apiKey = $_ENV['RELOOP_API_KEY'] ?? $_SERVER['RELOOP_API_KEY'];
        if (!$apiKey) {
            throw new \RuntimeException("RELOOP_API_KEY environment variable is missing!");
        }
        $this->reloop = Reloop::client($apiKey);
    }

    // 1. POST /api/api-keys - Create API Key
    public function create(array $body): array
    {
        $name = $body['name'] ?? null;
        if (!$name) {
            return ['status' => 400, 'body' => ['error' => 'Name is required']];
        }

        $result = $this->reloop->apiKeys->create(['name' => $name]);
        return ['status' => 201, 'body' => ['success' => true, 'data' => $result->toArray()]];
    }

      // 2. GET /api/api-keys - List API Keys
    public function list(array $queryParams): array
    {
        $limit = isset($queryParams['limit']) ? (int)$queryParams['limit'] : 10;
        $page = isset($queryParams['page']) ? (int)$queryParams['page'] : 1;

        $result = $this->reloop->apiKeys->list(['limit' => $limit, 'page' => $page]);

        $data = $result->toArray();
        if (isset($data['api_keys']) && is_array($data['api_keys'])) {
            $data['api_keys'] = array_map(function ($item) {
                return is_object($item) && method_exists($item, 'toArray') ? $item->toArray() : (array)$item;
            }, $data['api_keys']);
        }

        return ['status' => 200, 'body' => ['success' => true, 'data' => $data]];
    }

    // 3. GET /api/api-keys/{id} - Get API Key Details
    public function get(string $id): array
    {
        $result = $this->reloop->apiKeys->get($id);
        return ['status' => 200, 'body' => ['success' => true, 'data' => $result->toArray()]];
    }

    // 4. PATCH /api/api-keys/{id} - Update / Rename API Key
    public function update(string $id, array $body): array
    {
        $name = $body['name'] ?? null;
        if (!$name) {
            return ['status' => 400, 'body' => ['error' => 'Name is required']];
        }

        $result = $this->reloop->apiKeys->update($id, ['name' => $name]);
        return ['status' => 200, 'body' => ['success' => true, 'data' => $result->toArray()]];
    }

    // 5. POST /api/api-keys/{id}/disable - Disable API Key
    public function disable(string $id): array
    {
        $result = $this->reloop->apiKeys->disable($id);
        return ['status' => 200, 'body' => ['success' => true, 'data' => $result->toArray()]];
    }

    // 6. POST /api/api-keys/{id}/enable - Enable API Key
    public function enable(string $id): array
    {
        $result = $this->reloop->apiKeys->enable($id);
        return ['status' => 200, 'body' => ['success' => true, 'data' => $result->toArray()]];
    }

    // 7. POST /api/api-keys/{id}/rotate - Rotate API Key Secret
    public function rotate(string $id): array
    {
        $result = $this->reloop->apiKeys->rotate($id);
        return ['status' => 200, 'body' => ['success' => true, 'data' => $result->toArray()]];
    }

    // 8. DELETE /api/api-keys/{id} - Delete API Key
    public function delete(string $id): array
    {
        $result = $this->reloop->apiKeys->delete($id);
        return ['status' => 200, 'body' => ['success' => true, 'data' => $result->toArray()]];
    }
}
