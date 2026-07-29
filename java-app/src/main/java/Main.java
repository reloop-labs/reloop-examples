import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;
import com.fasterxml.jackson.databind.ObjectMapper;
import sh.reloop.models.Models.*;

import java.io.*;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.Properties;

public class Main {
    private static final ObjectMapper mapper = new ObjectMapper();
    private static ApiKeysController controller;

    public static void main(String[] args) throws Exception {
        loadDotEnv();

        String apiKey = System.getenv("RELOOP_API_KEY");
        if (apiKey == null || apiKey.isEmpty()) {
            apiKey = System.getProperty("RELOOP_API_KEY");
        }

        if (apiKey == null || apiKey.isEmpty()) {
            System.err.println("❌ ERROR: RELOOP_API_KEY is missing from .env!");
            System.exit(1);
        }

        controller = new ApiKeysController(apiKey);

        // Start Java JDK built-in HTTP Web Server on port 8080
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        server.createContext("/api/api-keys", new ApiKeyRouteHandler());
        server.setExecutor(null);

        System.out.println("🚀 Alex's Java Web Server running on http://localhost:8080");
        server.start();
    }

    static class ApiKeyRouteHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String method = exchange.getRequestMethod();
            String path = exchange.getRequestURI().getPath();
            String query = exchange.getRequestURI().getQuery();

            try {
                if ("POST".equalsIgnoreCase(method) && "/api/api-keys".equals(path)) {
                    // 1. Create Key
                    Map<String, String> body = mapper.readValue(exchange.getRequestBody(), Map.class);
                    ApiKeyWithKey result = controller.create(body.get("name"));
                    sendJsonResponse(exchange, 201, Map.of("success", true, "data", result));

                } else if ("GET".equalsIgnoreCase(method) && "/api/api-keys".equals(path)) {
                    // 2. List Keys
                    int limit = parseQueryParam(query, "limit", 10);
                    int page = parseQueryParam(query, "page", 1);
                    ApiKeyListResponse result = controller.list(limit, page);
                    sendJsonResponse(exchange, 200, Map.of("success", true, "data", result));

                } else if (path.matches("/api/api-keys/[^/]+")) {
                    String id = path.substring("/api/api-keys/".length());
                    if ("GET".equalsIgnoreCase(method)) {
                        // 3. Get Key
                        ApiKey result = controller.get(id);
                        sendJsonResponse(exchange, 200, Map.of("success", true, "data", result));

                    } else if ("PATCH".equalsIgnoreCase(method)) {
                        // 4. Update Key
                        Map<String, String> body = mapper.readValue(exchange.getRequestBody(), Map.class);
                        ApiKey result = controller.update(id, body.get("name"));
                        sendJsonResponse(exchange, 200, Map.of("success", true, "data", result));

                    } else if ("DELETE".equalsIgnoreCase(method)) {
                        // 8. Delete Key
                        DeleteApiKeyResponse result = controller.delete(id);
                        sendJsonResponse(exchange, 200, Map.of("success", true, "data", result));
                    }

                } else if (path.matches("/api/api-keys/[^/]+/disable") && "POST".equalsIgnoreCase(method)) {
                    // 5. Disable Key
                    String id = path.split("/")[3];
                    ApiKey result = controller.disable(id);
                    sendJsonResponse(exchange, 200, Map.of("success", true, "data", result));

                } else if (path.matches("/api/api-keys/[^/]+/enable") && "POST".equalsIgnoreCase(method)) {
                    // 6. Enable Key
                    String id = path.split("/")[3];
                    ApiKey result = controller.enable(id);
                    sendJsonResponse(exchange, 200, Map.of("success", true, "data", result));

                } else if (path.matches("/api/api-keys/[^/]+/rotate") && "POST".equalsIgnoreCase(method)) {
                    // 7. Rotate Key
                    String id = path.split("/")[3];
                    ApiKeyWithKey result = controller.rotate(id);
                    sendJsonResponse(exchange, 200, Map.of("success", true, "data", result));

                } else {
                    sendJsonResponse(exchange, 404, Map.of("error", "Route not found"));
                }
            } catch (Exception e) {
                sendJsonResponse(exchange, 400, Map.of("success", false, "error", e.getMessage()));
            }
        }
    }

    private static void sendJsonResponse(HttpExchange exchange, int statusCode, Object responseObj) throws IOException {
        byte[] responseBytes = mapper.writeValueAsString(responseObj).getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json");
        exchange.sendResponseHeaders(statusCode, responseBytes.length);
        OutputStream os = exchange.getResponseBody();
        os.write(responseBytes);
        os.close();
    }

    private static int parseQueryParam(String query, String name, int defaultValue) {
        if (query == null) return defaultValue;
        for (String param : query.split("&")) {
            String[] pair = param.split("=");
            if (pair.length == 2 && pair[0].equals(name)) {
                return Integer.parseInt(pair[1]);
            }
        }
        return defaultValue;
    }

    private static void loadDotEnv() {
        try {
            File envFile = new File(".env");
            if (envFile.exists()) {
                Properties props = new Properties();
                try (FileInputStream fis = new FileInputStream(envFile)) {
                    props.load(fis);
                    for (String name : props.stringPropertyNames()) {
                        System.setProperty(name, props.getProperty(name));
                    }
                }
            }
        } catch (Exception ignored) {}
    }
}
