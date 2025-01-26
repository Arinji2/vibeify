package indexing_helpers

import (
	"fmt"
	"sync"

	"github.com/Arinji2/vibeify-backend/api"
	pocketbase_helpers "github.com/Arinji2/vibeify-backend/tasks/helpers/pocketbase"
	"github.com/Arinji2/vibeify-backend/types"
)

func QueueSongIndexing(tracks []types.SpotifyPlaylistItem, priorityIndex string) {
	adminToken := pocketbase_helpers.GetPocketbaseAdminToken()

	client := api.NewApiClient()
	var wg sync.WaitGroup
	pool := make(chan struct{}, 10)
	defer close(pool)

	for _, track := range tracks {
		wg.Add(1)
		pool <- struct{}{}
		go func(track types.SpotifyPlaylistItem) {
			defer wg.Done()
			defer func() { <-pool }()

			if track.Track.IsLocal {
				return
			}

			err := sendSongToIndex(client, adminToken, track.Track.ID, priorityIndex)
			if err != nil {
				fmt.Println(err)
			}
		}(track)
	}

	wg.Wait()
}
