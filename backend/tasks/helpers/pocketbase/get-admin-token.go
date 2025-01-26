package pocketbase_helpers

import (
	"fmt"
	"log"
	"os"
	"sync"
	"time"

	"github.com/Arinji2/vibeify-backend/api"
)

var (
	tokenCache  string
	expiryCache time.Time
	mu          sync.Mutex
)

const tokenValidity = time.Hour * 24 * 7

func GetPocketbaseAdminToken() (token string) {

	mu.Lock()
	defer mu.Unlock()

	if time.Now().Before(expiryCache) && tokenCache != "" {
		token = tokenCache

		return token
	}

	identityEmail := os.Getenv("ADMIN_EMAIL")
	password := os.Getenv("ADMIN_PASSWORD")

	if identityEmail == "" || password == "" {
		log.Fatal("Environment Variables not present to authenticate Admin")

	}

	body := map[string]string{
		"identity": identityEmail,
		"password": password,
	}

	client := api.NewApiClient()
	result, _, err := client.SendRequestWithBody("POST", "/api/admins/auth-with-password", body, nil)

	if err != nil {
		fmt.Println("Admin Login failed:", err)
		return
	}

	token, ok := result["token"].(string)
	if !ok || token == "" {
		fmt.Println("Admin Token not found or not a string")
		return
	}

	tokenCache = token
	expiryCache = time.Now().Add(tokenValidity)

	return token

}
