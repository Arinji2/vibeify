package indexing_helpers

import (
	"encoding/json"
	"fmt"
	"os"
	"sync"

	"github.com/Arinji2/vibeify-backend/api"
	pocketbase_helpers "github.com/Arinji2/vibeify-backend/tasks/helpers/pocketbase"
	"github.com/Arinji2/vibeify-backend/types"
)

var (
	inProgress sync.Mutex
)

func CheckIndexing() {
	inProgress.Lock()
	defer inProgress.Unlock()

	client := api.NewApiClient()
	adminToken := pocketbase_helpers.GetPocketbaseAdminToken()

	res, _, error := client.SendRequestWithQuery("GET", "/api/collections/songsToIndex/records", map[string]string{
		"page":    "1",
		"perPage": "1",
		"fields":  "id"}, map[string]string{
		"Authorization": adminToken,
	})

	if error != nil {
		fmt.Println("index check:", error)

	}

	totalItems, ok := res["totalItems"].(float64)
	if !ok {
		fmt.Println("index check: Error getting total items")
	}

	if totalItems > 0 {
		PerformSongIndexing()

	}

}

func CheckPlaylistIndexing() {
	jsonFile, error := os.ReadFile("/tasks/helpers/pocketbase/indexing/indexable-playlists.json")

	if error != nil {
		fmt.Println(error)
		return
	}

	jsonData := []types.IndexablePlaylist{}
	var pool = make(chan struct{}, 2)

	error = json.Unmarshal(jsonFile, &jsonData)
	if error != nil {
		fmt.Println(error)
		return
	}

	isIndexing := IsIndexingSongs()

	if isIndexing {

		return
	}

	for _, playlist := range jsonData {

		pool <- struct{}{}
		go func(playlist types.IndexablePlaylist) {
			defer func() { <-pool }()

			PerformPlaylistIndexing(playlist)

		}(playlist)

	}

}
