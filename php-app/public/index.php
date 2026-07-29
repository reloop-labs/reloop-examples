<?php

require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;
use AlexApp\ApiKeysController;

// Load .env
$dotenv = Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

// Simple HTTP Router
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$body = json_decode(file_get_contents('php://input'), true) ?? [];

$controller = new ApiKeysController();

try {
    if ($method === 'POST' && $path === '/api/api-keys') {
        $res = $controller->create($body);
    } elseif ($method === 'GET' && $path === '/api/api-keys') {
        $res = $controller->list($_GET);
    } elseif (preg_match('#^/api/api-keys/([^/]+)$#', $path, $matches) && $method === 'GET') {
        $res = $controller->get($matches[1]);
    } elseif (preg_match('#^/api/api-keys/([^/]+)$#', $path, $matches) && $method === 'PATCH') {
        $res = $controller->update($matches[1], $body);
    } elseif (preg_match('#^/api/api-keys/([^/]+)/disable$#', $path, $matches) && $method === 'POST') {
        $res = $controller->disable($matches[1]);
    } elseif (preg_match('#^/api/api-keys/([^/]+)/enable$#', $path, $matches) && $method === 'POST') {
        $res = $controller->enable($matches[1]);
    } elseif (preg_match('#^/api/api-keys/([^/]+)/rotate$#', $path, $matches) && $method === 'POST') {
        $res = $controller->rotate($matches[1]);
    } elseif (preg_match('#^/api/api-keys/([^/]+)$#', $path, $matches) && $method === 'DELETE') {
        $res = $controller->delete($matches[1]);
    } else {
        $res = ['status' => 404, 'body' => ['error' => 'Route not found']];
    }

    http_response_code($res['status']);
    echo json_encode($res['body']);

} catch (\Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
