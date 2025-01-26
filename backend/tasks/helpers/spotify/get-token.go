package spotify_helpers

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"os"
	"strings"
	"sync"
	"time"
)

type TokenDataStruct struct {
	AccessToken  string `json:"access_token"`
	TokenType    string `json:"token_type"`
	ExpiresIn    int    `json:"expires_in"`
	RefreshToken string `json:"refresh_token"`
}

var (
	mu         sync.Mutex
	tokenCache string
	expiryTime time.Time
)

func BustSpotifyTokenCache() {

	mu.Lock()
	defer mu.Unlock()
	tokenCache = ""
	expiryTime = time.Time{}
}

func GetSpotifyToken() string {
	mu.Lock()
	defer mu.Unlock()

	if tokenCache != "" {
		if time.Now().Before(expiryTime) {
			return tokenCache
		} else {
			tokenCache = ""
			expiryTime = time.Time{}
		}
	}

	clientID := os.Getenv("SPOTIFY_CLIENT_ID")
	clientSecret := os.Getenv("SPOTIFY_CLIENT_SECRET")
	refreshToken := os.Getenv("SPOTIFY_REFRESH_TOKEN")

	data := url.Values{}
	data.Set("grant_type", "refresh_token")
	data.Set("refresh_token", refreshToken)

	req, err := http.NewRequest("POST", "https://accounts.spotify.com/api/token", strings.NewReader(data.Encode()))
	if err != nil {
		fmt.Println("Error creating request:", err)
		return ""
	}

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	req.Header.Set("Authorization", "Basic "+base64.StdEncoding.EncodeToString([]byte(clientID+":"+clientSecret)))

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Error making request:", err)
		return ""
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		fmt.Println("Error: Received status code", resp.StatusCode)
		return ""
	}

	buf := new(bytes.Buffer)
	buf.ReadFrom(resp.Body)

	tokenData := TokenDataStruct{}

	json.Unmarshal(buf.Bytes(), &tokenData)

	tokenCache = tokenData.AccessToken
	expiryTime = time.Now().Add(time.Duration(tokenData.ExpiresIn) * time.Second)

	return tokenData.AccessToken
}
