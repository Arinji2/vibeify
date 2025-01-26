package tasks

import (
	"fmt"
	"strings"

	custom_log "github.com/Arinji2/vibeify-backend/logger"
	"github.com/Arinji2/vibeify-backend/tasks/helpers"
	ai_helpers "github.com/Arinji2/vibeify-backend/tasks/helpers/ai"
	email_helpers "github.com/Arinji2/vibeify-backend/tasks/helpers/emails"
	pocketbase_helpers "github.com/Arinji2/vibeify-backend/tasks/helpers/pocketbase"
	indexing_helpers "github.com/Arinji2/vibeify-backend/tasks/helpers/pocketbase/indexing"
	spotify_helpers "github.com/Arinji2/vibeify-backend/tasks/helpers/spotify"
	"github.com/Arinji2/vibeify-backend/types"
)

func PerformTask(task types.AddTaskType) {
	defer func() {
		if r := recover(); r != nil {
			custom_log.Logger.Error("Task Failed: ", r)
		}
	}()

	custom_log.Logger.Debug("Performing Task")
	defer custom_log.Logger.Debug("Finished Performing Task")

	custom_log.Logger.Debug("Validating User")
	user, err := pocketbase_helpers.ValidateUser(task.UserToken)
	if err != nil {
		helpers.HandleError(err, "")
	}

	custom_log.Logger.Debug("Checking Limit")
	used, usesID, err := pocketbase_helpers.CheckLimit(user)

	if err != nil {
		helpers.HandleError(err, user.Record.Email)
	}

	custom_log.Logger.Debug("Sending Addition Email")
	email_helpers.SendQueueAdditionEmail(user.Record.Premium, user.Record.Email)

	custom_log.Logger.Debug("Getting Spotify Playlist")
	tracks, playlistName, err := spotify_helpers.GetSpotifyPlaylist(task.SpotifyURL, user, "")
	if err != nil {
		helpers.HandleError(err, user.Record.Email)
	}

	genreArrays := setupArrays(task)

	custom_log.Logger.Debug("Getting Internal Genre")
	updatedTracks, err := pocketbase_helpers.GetInternalGenre(tracks, task.Genres, genreArrays)
	if err != nil {
		helpers.HandleError(err, user.Record.Email)
	}

	custom_log.Logger.Debug("Getting External Genre")
	ai_helpers.GetExternalGenre(updatedTracks, task.Genres, genreArrays)

	custom_log.Logger.Debug("Creating Playlists")
	createdPlaylists, err := spotify_helpers.CreatePlaylists(playlistName, genreArrays)
	if err != nil {
		helpers.HandleError(err, user.Record.Email)
	}

	custom_log.Logger.Debug("Updating Uses")
	err = pocketbase_helpers.UpdateLimit(user, used, usesID)
	if err != nil {
		helpers.HandleError(err, user.Record.Email)
	}

	custom_log.Logger.Debug("Recording Deletion")
	err = pocketbase_helpers.RecordPlaylistForDeletion(user, createdPlaylists)
	if err != nil {
		helpers.HandleError(err, user.Record.Email)
	}

	emailItems := getEmailItems(createdPlaylists)

	custom_log.Logger.Debug("Sending Finish Email")
	email_helpers.SendQueueFinishEmail(user.Record.Premium, used+1, emailItems, user.Record.Email)

	custom_log.Logger.Debug("Indexing Songs")
	go indexing_helpers.QueueSongIndexing(updatedTracks, "1")

}

func setupArrays(task types.AddTaskType) types.GenreArrays {
	genreArrays := types.GenreArrays{}

	for i, genre := range task.Genres {
		genre = strings.ToLower(genre)
		genreArrays[genre] = []types.GenreArray{}
		task.Genres[i] = genre

	}

	genreArrays["unknown"] = []types.GenreArray{}
	return genreArrays
}

func getEmailItems(playlists []types.SpotifyPlaylist) []types.QueueFinishedEmailItems {
	emailItems := []types.QueueFinishedEmailItems{}

	for i, playlist := range playlists {
		data := types.QueueFinishedEmailItems{
			ID:   i + 1,
			Name: playlist.Name,
			URL:  fmt.Sprintf("https://open.spotify.com/playlist/%s", playlist.ID),
		}

		emailItems = append(emailItems, data)
	}
	return emailItems
}
