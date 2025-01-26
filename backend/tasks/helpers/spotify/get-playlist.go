package spotify_helpers

import (
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"github.com/Arinji2/vibeify-backend/api"
	"github.com/Arinji2/vibeify-backend/cache"
	"github.com/Arinji2/vibeify-backend/constants"
	"github.com/Arinji2/vibeify-backend/types"
	user_errors "github.com/Arinji2/vibeify-backend/user-errors"
)

var (
	retries       int = 0
	playlistCache     = cache.NewCache(500, 10*time.Minute)
)

func GetSpotifyPlaylist(url string, user *types.PocketbaseUser, fields string) (tracks []types.SpotifyPlaylistItem, playlistName string, err error) {
	tracks = nil
	if fields == "" {
		fields = "id,name,description,owner(display_name,id),tracks.items(added_at,track(id,name,artists(id,name),album(id,name),external_urls.spotify,uri)),tracks.total,tracks.offset,tracks.limit"
	}

	playlistID := CleanupID(url)

	if cachedData, found := playlistCache.Get(playlistID); found {
		playlist := cachedData.(types.SpotifyPlaylist)
		tracks = playlist.Tracks.Items
		playlistName = playlist.Name
		return
	}

	token := GetSpotifyToken()

	client := api.NewApiClient("https://api.spotify.com/v1")
	res, status, err := client.SendRequestWithQuery("GET", fmt.Sprintf("/playlists/%s", playlistID), map[string]string{
		"fields": fields,
	}, map[string]string{
		"Authorization": fmt.Sprintf("Bearer %s", token),
	})

	if err != nil {
		return nil, "", user_errors.NewUserError("", fmt.Errorf("error sending request: %v", err))
	}

	if status == 400 {

		return nil, "", user_errors.NewUserError("Playlist not found or Playlist is private", err)
	}

	if status == 401 {
		BustSpotifyTokenCache()
		retries++
		if retries < 3 {
			fmt.Println("Retrying Spotify Authentication")
			return GetSpotifyPlaylist(url, user, fields)
		} else {

			return nil, "", user_errors.NewUserError("", errors.New("spotify token expired"))
		}
	}

	var Playlist types.SpotifyPlaylist
	jsonData, err := json.Marshal(res)
	if err != nil {

		return nil, "", user_errors.NewUserError("", (fmt.Errorf("error marshalling response: %v", err)))
	}

	err = json.Unmarshal(jsonData, &Playlist)
	if err != nil {
		return nil, "", user_errors.NewUserError("", fmt.Errorf("error unmarshalling into struct: %v", err))
	}

	isSystemCalled := false
	if user == nil {
		isSystemCalled = true
	}
	if !isSystemCalled {
		if Playlist.Tracks.Total > constants.MAX_FREE_PLAYLIST_SIZE && !user.Record.Premium {
			return nil, "", user_errors.NewUserError(fmt.Sprintf("Playlist is too large. Maximum size is %d tracks for free users", constants.MAX_FREE_PLAYLIST_SIZE), errors.New("playlist-exceeds-free-limit"))
		}

		if Playlist.Tracks.Total > constants.MAX_PAID_PLAYLIST_SIZE && user.Record.Premium {
			return nil, "", user_errors.NewUserError(fmt.Sprintf("Playlist is too large. Maximum size is %d tracks for premium users", constants.MAX_PAID_PLAYLIST_SIZE), errors.New("playlist-exceeds-paid-limit"))
		}
	}

	localTracks, err := GetPaginatedTracks(Playlist, token, playlistID, !isSystemCalled)

	if err != nil {
		return nil, "", err
	}

	Playlist.Tracks.Items = append(Playlist.Tracks.Items, localTracks...)
	tracks = Playlist.Tracks.Items
	playlistCache.Set(playlistID, Playlist, time.Hour)

	playlistName = Playlist.Name

	return tracks, playlistName, nil
}

func GetPaginatedTracks(Playlist types.SpotifyPlaylist, token string, playlistID string, userErrors bool) (tracks []types.SpotifyPlaylistItem, err error) {
	localPlaylist := Playlist
	client := api.NewApiClient("https://api.spotify.com/v1")

	for {
		if (localPlaylist.Tracks.Offset + localPlaylist.Tracks.Limit) >= localPlaylist.Tracks.Total {
			break
		}
		localPlaylist.Tracks.Offset += localPlaylist.Tracks.Limit
		res, _, err := client.SendRequestWithQuery("GET", fmt.Sprintf("/playlists/%s/tracks", playlistID), map[string]string{
			"fields": "items(added_at,track(id,name,artists(id,name),album(id,name),external_urls.spotify,uri)),total,offset,limit",
			"limit":  "100",
			"offset": fmt.Sprintf("%d", localPlaylist.Tracks.Offset),
		}, map[string]string{
			"Authorization": fmt.Sprintf("Bearer %s", token),
		})

		Items := []types.SpotifyPlaylistItem{}
		if err != nil {
			if userErrors {
				return nil, user_errors.NewUserError("", fmt.Errorf("error sending request: %v", err))
			} else {
				return nil, fmt.Errorf("error sending request: %v", err)
			}
		}

		jsonData, err := json.Marshal(res["items"])
		if err != nil {
			if userErrors {
				return nil, user_errors.NewUserError("", fmt.Errorf("error marshalling response: %v", err))
			} else {
				return nil, fmt.Errorf("error marshalling response: %v", err)
			}
		}

		err = json.Unmarshal(jsonData, &Items)
		if err != nil {
			if userErrors {
				return nil, user_errors.NewUserError("", fmt.Errorf("error unmarshalling into struct: %v", err))
			} else {
				return nil, fmt.Errorf("error unmarshalling into struct: %v", err)
			}
		}

		localPlaylist.Tracks.Items = append(localPlaylist.Tracks.Items, Items...)
	}

	return localPlaylist.Tracks.Items, nil
}
