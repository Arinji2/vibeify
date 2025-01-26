package indexing_helpers

import (
	"fmt"
	"sync"
	"sync/atomic"

	"github.com/Arinji2/vibeify-backend/api"
	pocketbase_helpers "github.com/Arinji2/vibeify-backend/tasks/helpers/pocketbase"
	spotify_helpers "github.com/Arinji2/vibeify-backend/tasks/helpers/spotify"
	"github.com/Arinji2/vibeify-backend/types"
)

var (
	indexingWg      sync.WaitGroup
	indexingRunning int32
)

func PerformSongIndexing() {
	if !atomic.CompareAndSwapInt32(&indexingRunning, 0, 1) {
		return
	}
	indexingWg.Add(1)
	defer func() {
		indexingWg.Done()
		atomic.StoreInt32(&indexingRunning, 0)
	}()
	client := api.NewApiClient()
	adminToken := pocketbase_helpers.GetPocketbaseAdminToken()

	songsToIndex, error := getSongsToIndex(client, adminToken)
	if error != nil {
		fmt.Println(error)
		return
	}

	spotifyTracks, error := fetchSpotifyTracks(songsToIndex)
	if error != nil {
		fmt.Println(error)
		return
	}

	var wg sync.WaitGroup
	pool := make(chan struct{}, 2)

	for _, song := range spotifyTracks {
		wg.Add(1)
		pool <- struct{}{}
		go func(song types.SpotifyTrack) {
			defer wg.Done()
			defer func() { <-pool }()

			if err := indexSong(client, adminToken, song); err != nil {
				fmt.Println(err)
			}
		}(song)
	}

	wg.Wait()
}

func IsIndexingSongs() bool {
	return atomic.LoadInt32(&indexingRunning) == 1
}

func PerformPlaylistIndexing(playlist types.IndexablePlaylist) {

	tracks, _, _ := spotify_helpers.GetSpotifyPlaylist(playlist.Link, nil, "")

	go QueueSongIndexing(tracks, "0")

}
