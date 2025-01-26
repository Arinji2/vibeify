package api

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"os"
	"time"
)

type HTTPClient interface {
	Do(req *http.Request) (*http.Response, error)
}

type ApiClient struct {
	BaseURL string
	Client  HTTPClient
}

func NewApiClient(baseURL ...string) *ApiClient {
	var url string
	if len(baseURL) > 0 {
		url = baseURL[0]
	} else {
		url = ""
	}

	if url == "" {

		url = os.Getenv("PB_LINK")
	}

	return &ApiClient{
		BaseURL: url,
		Client:  &http.Client{},
	}
}

func (c *ApiClient) doRequest(req *http.Request, headers map[string]string) (map[string]interface{}, int, error) {
	req.Header.Set("Content-Type", "application/json")
	for key, val := range headers {
		req.Header.Set(key, val)
	}

	var result map[string]interface{}
	var resp *http.Response
	var err error
	const maxRetries = 3
	var retryDelay = 100 * time.Millisecond

	for i := 0; i < maxRetries; i++ {
		resp, err = c.Client.Do(req)
		if err != nil {
			return nil, 0, fmt.Errorf("error sending request: %w", err)
		}
		defer resp.Body.Close()

		if resp.StatusCode == http.StatusTooManyRequests && c.BaseURL == "https://api.spotify.com" {
			retryAfter := resp.Header.Get("Retry-After")
			if retryAfter != "" {
				delay, err := time.ParseDuration(retryAfter + "s")
				if err != nil {
					return nil, resp.StatusCode, fmt.Errorf("error parsing Retry-After header: %w", err)
				}
				time.Sleep(delay)
			} else {
				time.Sleep(retryDelay)
			}
			retryDelay *= 2 // Exponential backoff
			continue
		}

		if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusNoContent && resp.StatusCode != http.StatusCreated {
			return nil, resp.StatusCode, nil
		}

		if resp.StatusCode == http.StatusNoContent {
			return result, resp.StatusCode, nil
		}
		if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
			return nil, resp.StatusCode, fmt.Errorf("error decoding response: %w", err)
		}

		return result, resp.StatusCode, nil
	}

	return nil, http.StatusTooManyRequests, fmt.Errorf("maximum retry attempts reached")
}

func (c *ApiClient) SendRequestWithBody(method, path string, body interface{}, headers map[string]string) (result map[string]interface{}, status int, err error) {
	address := fmt.Sprintf("%s%s", c.BaseURL, path)

	jsonBody, err := json.Marshal(body)
	if err != nil {
		status = 500
		err = fmt.Errorf("error marshalling json: %w", err)
		return
	}

	req, err := http.NewRequest(method, address, bytes.NewBuffer(jsonBody))
	if err != nil {
		status = 500
		err = fmt.Errorf("error creating request: %w", err)
		return
	}

	req.Header.Set("Content-Type", "application/json")
	for key, val := range headers {
		req.Header.Set(key, val)
	}

	result, status, err = c.doRequest(req, headers)
	if err != nil {
		err = fmt.Errorf("error from request doer: %w", err)
		return
	}

	return
}

func (c *ApiClient) SendRequestWithQuery(method, path string, query map[string]string, headers map[string]string) (result map[string]interface{}, status int, err error) {
	queryParams := url.Values{}
	for key, value := range query {
		queryParams.Add(key, value)
	}

	address, err := url.JoinPath(c.BaseURL, path)
	if err != nil {
		status = 500
		err = fmt.Errorf("error joining URL paths: %w", err)
		return
	}

	fullURL := fmt.Sprintf("%s?%s", address, queryParams.Encode())
	req, err := http.NewRequest(method, fullURL, nil)
	if err != nil {
		status = 500
		err = fmt.Errorf("error creating request: %w", err)
		return
	}

	result, status, err = c.doRequest(req, headers)
	if err != nil {
		err = fmt.Errorf("error from request doer: %w", err)
		return
	}

	return
}
