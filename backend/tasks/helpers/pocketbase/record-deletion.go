package pocketbase_helpers

import (
	"fmt"
	"sync"
	"time"

	"github.com/Arinji2/vibeify-backend/api"
	"github.com/Arinji2/vibeify-backend/types"
	user_errors "github.com/Arinji2/vibeify-backend/user-errors"
)

func RecordPlaylistForDeletion(user *types.PocketbaseUser, playlists []types.SpotifyPlaylist) error {

	adminToken := GetPocketbaseAdminToken()

	client := api.NewApiClient()

	var dateToBeDeleted string
	if user.Record.Premium {
		deletionTime := time.Now().Add(time.Hour * 50)
		dateToBeDeleted = deletionTime.Format("2006-01-02 15:04:05.000Z")
	} else {
		deletionTime := time.Now().Add(time.Hour * 24)
		dateToBeDeleted = deletionTime.Format("2006-01-02 15:04:05.000Z")
	}
	var wg sync.WaitGroup

	errorChan := make(chan error, len(playlists))

	for _, playlist := range playlists {
		wg.Add(1)

		go func(playlist types.SpotifyPlaylist) {
			defer wg.Done()

			_, _, err := client.SendRequestWithBody("POST", "/api/collections/convertDeletion/records", map[string]string{
				"toBeDeleted": dateToBeDeleted,
				"playlistID":  playlist.ID,
			}, map[string]string{
				"Authorization": adminToken,
			})

			if err != nil {
				errorChan <- user_errors.NewUserError("", err)
				return
			}

		}(playlist)
	}

	go func() {
		wg.Wait()
		close(errorChan)
	}()
	finalErrors := []error{}
	for err := range errorChan {
		if err != nil {
			finalErrors = append(finalErrors, err)
		}
	}

	if len(finalErrors) > 0 {
		return user_errors.NewUserError("", fmt.Errorf("error recording deletion: %v", finalErrors))
	}
	return nil
}
