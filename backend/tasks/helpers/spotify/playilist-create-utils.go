package spotify_helpers

import (
	"encoding/json"
	"fmt"
	"os"
	"regexp"
	"strings"
	"time"

	"github.com/Arinji2/vibeify-backend/api"
	"github.com/Arinji2/vibeify-backend/types"
)

func createGenrePlaylist(genreKey string, playlistName string, headers map[string]string) (errorString string, createdPlaylist types.SpotifyPlaylist) {

	errorString = "Server Error"
	userID := os.Getenv("SPOTIFY_ID")
	dateString := time.Now().Format("2006-01-02")
	displayGenre := strings.ToUpper(genreKey[:1]) + genreKey[1:]
	createdPlaylistName := fmt.Sprintf("%s - %s - %s", playlistName, displayGenre, dateString)
	client := api.NewApiClient("https://api.spotify.com")

	res, _, err := client.SendRequestWithBody("POST", fmt.Sprintf("/v1/users/%s/playlists", userID), map[string]string{
		"name":        createdPlaylistName,
		"public":      "true",
		"description": fmt.Sprintf("%s playlist created by Vibeify for %s", displayGenre, playlistName),
	}, headers)

	if err != nil {
		errorString = "Error creating playlist"
		return
	}

	var Playlist types.SpotifyPlaylist
	jsonData, err := json.Marshal(res)
	if err != nil {
		fmt.Printf("Error marshalling response: %v", err)

		return
	}

	err = json.Unmarshal(jsonData, &Playlist)
	if err != nil {
		fmt.Printf("Error unmarshalling into struct: %v", err)

		return
	}

	createdPlaylist = Playlist
	errorString = ""

	return
}

func initPlaylist(playlist types.SpotifyPlaylist, genreArrays []types.GenreArray, headers map[string]string) (errorString string) {

	client := api.NewApiClient("https://api.spotify.com")

	errorString = "Server Error"

	pattern := `^spotify:track:[A-Za-z0-9]+$`
	re := regexp.MustCompile(pattern)

	uris := []string{}
	for _, genre := range genreArrays {
		if !re.MatchString(genre.URI) {
			continue
		}

		uris = append(uris, genre.URI)
	}

	const batchSize = 100
	totalItems := len(uris)

	for i := 0; i < totalItems; i += batchSize {
		end := i + batchSize
		if end > totalItems {
			end = totalItems
		}

		batch := uris[i:end]

		body := map[string]interface{}{
			"uris": batch,
		}

		_, _, err := client.SendRequestWithBody("POST", fmt.Sprintf("/v1/playlists/%s/tracks", playlist.ID), body, headers)
		if err != nil {
			fmt.Println(err)
			return
		}

	}

	errorString = ""
	return
}
