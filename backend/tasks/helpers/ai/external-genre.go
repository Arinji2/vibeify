package ai_helpers

import (
	"fmt"
	"os"
	"slices"
	"strings"
	"sync"
	"time"

	"github.com/Arinji2/vibeify-backend/api"
	custom_log "github.com/Arinji2/vibeify-backend/logger"
	"github.com/Arinji2/vibeify-backend/types"
)

func GetExternalGenre(remainingTracks []types.SpotifyPlaylistItem, genres []string, genreArrays types.GenreArrays, updatedPrompt ...string) {

	accessKey := os.Getenv("ACCESS_KEY")

	client := api.NewApiClient("https://ai.arinji.com")

	var wg sync.WaitGroup
	var mu sync.Mutex
	var pool = make(chan struct{}, 10)

	for _, track := range remainingTracks {
		wg.Add(1)
		pool <- struct{}{}
		go func(track types.SpotifyPlaylistItem) {
			defer wg.Done()
			defer func() {
				<-pool
			}()

			artistString := ""
			genreString := ""
			for _, artist := range track.Track.Artists {
				artistString = artistString + artist.Name + ", "
			}
			for _, genre := range genres {
				genreString = genreString + genre + ", "
			}

			prompt := fmt.Sprintf("Given the song name %s by artists %s, you are to guess the genre of the song. The available genres are %s. Reply with ONLY one genre from this list, nothing else.", track.Track.Name, artistString, genreString)

			if len(updatedPrompt) > 0 {
				prompt = prompt + updatedPrompt[0]
			}

			retries := 0
			maxRetries := 3
			for retries < maxRetries {
				body := []map[string]string{
					{
						"role":    "user",
						"content": prompt,
					},
				}
				headers := map[string]string{
					"Content-Type":  "application/json",
					"Authorization": accessKey,
				}

				res, status, err := client.SendRequestWithBody("POST", "/completions", body, headers)
				if err != nil || status != 200 {
					retries++
					if status == 500 {
						//this is when the AI API is overloaded, we wait here
						time.Sleep(time.Second * 30)
					}
					continue
				}

				message, ok := res["message"].(string)
				if !ok {
					fmt.Println("Error converting message to string")
					retries++
					continue
				}

				message = strings.ToLower(message)

				if slices.Contains(genres, message) {
					mu.Lock()
					genreArrays[message] = append(genreArrays[message], types.GenreArray{
						URI: track.Track.URI,
					})
					mu.Unlock()
					break
				} else {

					updatedPromptString := fmt.Sprintf("Do not say %s", message)
					prompt = prompt + updatedPromptString
					retries++
					custom_log.Logger.Info("Retrying AI Request With Updated Prompt")
				}
			}

			if retries == maxRetries {
				mu.Lock()
				genreArrays["unknown"] = append(genreArrays["unknown"], types.GenreArray{
					URI: track.Track.URI,
				})
				mu.Unlock()
			}

		}(track)
	}

	wg.Wait()

}
