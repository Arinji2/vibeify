package indexing_helpers

import (
	"fmt"
	"math"
	"sync"

	"github.com/Arinji2/vibeify-backend/api"
	"github.com/Arinji2/vibeify-backend/constants"
	custom_log "github.com/Arinji2/vibeify-backend/logger"
	pocketbase_helpers "github.com/Arinji2/vibeify-backend/tasks/helpers/pocketbase"
)

func CleanupIndexing() {
	adminToken := pocketbase_helpers.GetPocketbaseAdminToken()

	client := api.NewApiClient()
	res, _, error := client.SendRequestWithQuery("GET", "/api/collections/songs/records", map[string]string{
		"page":    "1",
		"perPage": "1",
		"fields":  "id",
	}, map[string]string{
		"Authorization": adminToken,
	})

	if error != nil {
		fmt.Println(error)
		return
	}

	totalRecords, ok := res["totalItems"].(float64)
	if !ok {
		fmt.Println("index cleanup: Error getting total records")
	}

	if totalRecords < constants.MAX_SONGS_ALLOWED {
		return
	}

	perPage := math.Max((totalRecords - constants.MAX_SONGS_ALLOWED), constants.MAX_SONGS_ALLOWED)

	res, _, error = client.SendRequestWithQuery("GET", "/api/collections/songs/records", map[string]string{
		"page":      "1",
		"perPage":   fmt.Sprintf("%v", perPage),
		"fields":    "id",
		"sort":      "totalUses",
		"skipTotal": "true",
	}, map[string]string{
		"Authorization": adminToken,
	})

	if error != nil {
		fmt.Println(error)
		return
	}

	items, ok := res["items"].([]interface{})
	if !ok {
		fmt.Println("index cleanup: Error getting items")
		return
	}

	pool := make(chan struct{}, 5)
	cleanupWg := sync.WaitGroup{}

	custom_log.Logger.Debug("Extra Songs Found, Purging.")

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

			_, _, error := client.SendRequestWithQuery("DELETE", "/api/collections/songs/records/"+id.(string), nil, map[string]string{
				"Authorization": adminToken,
			})

			if error != nil {
				fmt.Println(error)
				return
			}

		}(item)
	}
}
