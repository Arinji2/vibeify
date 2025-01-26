package indexing_helpers

import (
	"encoding/json"
	"fmt"
	"strings"
	"sync"

	"github.com/Arinji2/vibeify-backend/api"
	custom_log "github.com/Arinji2/vibeify-backend/logger"
	ai_helpers "github.com/Arinji2/vibeify-backend/tasks/helpers/ai"
	pocketbase_helpers "github.com/Arinji2/vibeify-backend/tasks/helpers/pocketbase"
	spotify_helpers "github.com/Arinji2/vibeify-backend/tasks/helpers/spotify"
	"github.com/Arinji2/vibeify-backend/types"
)

func checkIfIndexQueued(client *api.ApiClient, adminToken string, spotifyID string) (bool, error) {
	res, _, err := client.SendRequestWithQuery("GET", "/api/collections/songsToIndex/records", map[string]string{
		"page":    "1",
		"perPage": "1",
		"sort":    "-created,priority",
		"filter":  fmt.Sprintf(`spotifyID="%s"`, spotifyID),
	}, map[string]string{
		"Authorization": adminToken,
	})

	if err != nil {
		return false, err
	}

	totalItems, ok := res["totalItems"].(float64)
	if !ok {
		return false, fmt.Errorf("error parsing total items for songsIndex")
	}

	if totalItems > 0 {
		return true, nil
	}

	res, _, err = client.SendRequestWithQuery("GET", "/api/collections/songs/records", map[string]string{
		"page":    "1",
		"perPage": "1",
		"filter":  fmt.Sprintf(`spotifyID="%s"`, spotifyID),
	}, map[string]string{
		"Authorization": adminToken,
	})

	if err != nil {
		return false, err
	}

	totalItems, ok = res["totalItems"].(float64)
	if !ok {
		return false, fmt.Errorf("error parsing total items for songs")
	}

	if totalItems > 0 {
		return true, nil
	}

	return false, nil
}

func sendSongToIndex(client *api.ApiClient, adminToken string, spotifyID string, priority string) error {
	exists, error := checkIfIndexQueued(client, adminToken, spotifyID)
	if error != nil {
		return error
	}

	if exists {
		return nil
	}

	if spotifyID == "" {
		return nil
	}
	_, _, err := client.SendRequestWithBody("POST", "/api/collections/songsToIndex/records", map[string]string{
		"spotifyID": spotifyID,
		"priority":  priority,
	}, map[string]string{
		"Authorization": adminToken,
	})
	return err
}

func getSongsToIndex(client *api.ApiClient, adminToken string) ([]types.PocketbaseSongIndexQueue, error) {
	songsList, _, err := client.SendRequestWithQuery("GET", "/api/collections/songsToIndex/records", map[string]string{
		"page":    "1",
		"perPage": "10",
		"sort":    "-created,priority",
	}, map[string]string{
		"Authorization": adminToken,
	})
	if err != nil {
		return nil, err
	}

	songsItems, ok := songsList["items"].([]interface{})
	if !ok {
		return nil, fmt.Errorf("songs index: error parsing songs list")
	}

	var songsToIndex []types.PocketbaseSongIndexQueue
	jsonMarshalled, err := json.Marshal(songsItems)
	if err != nil {
		return nil, err
	}

	if err := json.Unmarshal(jsonMarshalled, &songsToIndex); err != nil {
		return nil, err
	}

	return songsToIndex, nil
}

func fetchSpotifyTracks(songsToIndex []types.PocketbaseSongIndexQueue) ([]types.SpotifyTrack, error) {
	spotifyClient := api.NewApiClient("https://api.spotify.com")
	spotifyToken := spotify_helpers.GetSpotifyToken()
	spotifyIDS := make([]string, len(songsToIndex))

	for i, song := range songsToIndex {
		spotifyIDS[i] = song.SpotifyID
	}

	spotifyIDStringified := strings.Join(spotifyIDS, ",")
	res, _, err := spotifyClient.SendRequestWithQuery("GET", "/v1/tracks", map[string]string{
		"ids": spotifyIDStringified,
	}, map[string]string{
		"Authorization": fmt.Sprintf("Bearer %s", spotifyToken),
	})
	if err != nil {
		return nil, err
	}

	tracks, ok := res["tracks"].([]interface{})
	if !ok {
		return nil, fmt.Errorf("songs index: error parsing tracks")
	}

	var spotifyTracks []types.SpotifyTrack
	jsonMarshalled, err := json.Marshal(tracks)
	if err != nil {
		return nil, err
	}

	if err := json.Unmarshal(jsonMarshalled, &spotifyTracks); err != nil {
		fmt.Println(err)
		return nil, err
	}

	pocketbaseClient := api.NewApiClient("https://db-listify.arinji.com")
	adminToken := pocketbase_helpers.GetPocketbaseAdminToken()
	var deletionWg sync.WaitGroup

	for _, track := range spotifyTracks {
		if track.Name == "" {
			custom_log.Logger.Info(fmt.Sprintf("Song removed from index due to market not available %s", track.ID))
			deletionWg.Add(1)
			go func() {
				deleteSongFromIndex(pocketbaseClient, adminToken, track.ID)
				deletionWg.Done()
			}()

		}
	}

	deletionWg.Wait()

	return spotifyTracks, nil
}

func indexSong(client *api.ApiClient, adminToken string, song types.SpotifyTrack) error {
	songGenres := ai_helpers.IndexGenre(song)
	if songGenres == nil {
		return nil
	}
	if _, _, err := client.SendRequestWithBody("POST", "/api/collections/songs/records", map[string]any{
		"spotifyID": song.ID,
		"genres":    songGenres,
	}, map[string]string{
		"Authorization": adminToken,
	}); err != nil {
		return err
	}

	if err := deleteSongFromIndex(client, adminToken, song.ID); err != nil {
		return err
	}

	return nil
}

func deleteSongFromIndex(client *api.ApiClient, adminToken string, spotifyID string) error {
	res, _, err := client.SendRequestWithQuery("GET", "/api/collections/songsToIndex/records", map[string]string{
		"page":    "1",
		"perPage": "1",
		"sort":    "-created",
		"filter":  fmt.Sprintf(`spotifyID="%s"`, spotifyID),
	}, map[string]string{
		"Authorization": adminToken,
	})
	if err != nil {
		return err
	}

	songsItemsLocal, ok := res["items"].([]interface{})
	if !ok {
		return fmt.Errorf("error parsing local songs list")
	}

	jsonMarshalled, err := json.Marshal(songsItemsLocal[0])
	if err != nil {
		return err
	}

	var songToIndex types.PocketbaseSongIndexQueue
	if err := json.Unmarshal(jsonMarshalled, &songToIndex); err != nil {
		return err
	}

	_, status, err := client.SendRequestWithBody("DELETE", fmt.Sprintf("/api/collections/songsToIndex/records/%s", songToIndex.Id), nil, map[string]string{
		"Authorization": adminToken,
	})
	if err != nil {
		return err
	}

	if status != 204 {
		return fmt.Errorf("error deleting song from index")
	}

	return nil
}
