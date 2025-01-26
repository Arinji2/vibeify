package pocketbase_helpers

import (
	"fmt"
	"sync"
	"time"

	"github.com/Arinji2/vibeify-backend/api"
	custom_log "github.com/Arinji2/vibeify-backend/logger"
)

func DeleteExpiredPlaylists() {

	adminToken := GetPocketbaseAdminToken()
	client := api.NewApiClient()
	currentTime := time.Now()

	formattedTime := currentTime.Format("2006-01-02 15:04:05")

	res, _, error := client.SendRequestWithQuery("GET", "/api/collections/convertDeletion/records", map[string]string{
		"page":    "1",
		"perPage": "500",
		"filter":  fmt.Sprintf(`toBeDeleted < "%s"`, formattedTime),
		"fields":  "id",
	}, map[string]string{
		"Authorization": adminToken,
	})

	if error != nil {
		fmt.Println(error)

	}

	totalItems, ok := res["totalItems"].(float64)
	if !ok {
		fmt.Println("Error getting total items")

	}

	if totalItems == 0 {
		return
	}

	custom_log.Logger.Debug("Expired Playlists Found, Purging. Total Items: ", totalItems)

	items, ok := res["items"].([]interface{})
	if !ok {
		fmt.Println("Error getting items")

	}

	pool := make(chan struct{}, 5)
	var cleanupWg sync.WaitGroup

	for _, item := range items {
		cleanupWg.Add(1)
		pool <- struct{}{}
		go func(item interface{}) {
			defer cleanupWg.Done()
			defer func() { <-pool }()

			id, ok := item.(map[string]interface{})["id"]
			if !ok {
				fmt.Println("Error getting id")
				return
			}

			_, _, error := client.SendRequestWithQuery("DELETE", "/api/collections/convertDeletion/records/"+id.(string), nil, map[string]string{
				"Authorization": adminToken,
			})

			if error != nil {
				fmt.Println(error)
				return
			}

		}(item)
	}

	cleanupWg.Wait()
	close(pool)

}
