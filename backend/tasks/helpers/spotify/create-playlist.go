package spotify_helpers

import (
	"errors"
	"fmt"
	"sync"

	"github.com/Arinji2/vibeify-backend/types"
	user_errors "github.com/Arinji2/vibeify-backend/user-errors"
)

func CreatePlaylists(playlistName string, genreArrays types.GenreArrays) (createdPlaylists []types.SpotifyPlaylist, err error) {

	accessToken := GetSpotifyToken()

	spotifyHeaders := map[string]string{
		"Authorization": fmt.Sprintf("Bearer %s", accessToken),
	}
	var wg sync.WaitGroup

	for key, genre := range genreArrays {
		wg.Add(1)
		go func(key string, genre []types.GenreArray) {

			defer wg.Done()
			if len(genre) == 0 {
				return
			}
			err, createdPlaylist := createGenrePlaylist(key, playlistName, spotifyHeaders)
			if err != "" {

				fmt.Println(err)

				return
			}

			err = initPlaylist(createdPlaylist, genre, spotifyHeaders)
			if err != "" {

				fmt.Println(err)

				return
			}

			createdPlaylists = append(createdPlaylists, createdPlaylist)
		}(key, genre)
	}

	wg.Wait()

	if len(createdPlaylists) == 0 {
		return nil, user_errors.NewUserError("No Playlists Created. This is likely due to our algorithm having issues with your songs, try with a different playlist.", errors.New("no-playlists-created"))

	}

	return
}
