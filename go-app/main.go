package main

import (
	"bufio"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"alex-go-app/controllers"
	reloop "github.com/reloop-labs/reloop-go/v2"
)

func loadEnv() {
	file, err := os.Open(".env")
	if err != nil {
		return
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		parts := strings.SplitN(line, "=", 2)
		if len(parts) == 2 {
			os.Setenv(parts[0], parts[1])
		}
	}
}

func main() {
	loadEnv()

	apiKey := os.Getenv("RELOOP_API_KEY")
	if apiKey == "" {
		apiKey = "rl_prod_MfCFoT2Q25weJ9t2yjZvrG5TNW8"
	}

	client, err := reloop.NewClient(reloop.ClientOptions{
		APIKey: apiKey,
	})
	if err != nil {
		log.Fatalf("Failed to initialize Reloop SDK: %v", err)
	}

	// Initialize Controllers
	apiKeysController := controllers.NewApiKeysController(client)

	// Register Routes
	http.HandleFunc("/api/api-keys", apiKeysController.HandleRoot)
	http.HandleFunc("/api/api-keys/", apiKeysController.HandleByID)

	fmt.Println("🚀 Alex's Go Web Server running on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
