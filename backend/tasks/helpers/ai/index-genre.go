package ai_helpers

import (
	"fmt"
	"os"
	"slices"
	"strings"
	"time"

	"github.com/Arinji2/vibeify-backend/api"
	"github.com/Arinji2/vibeify-backend/types"
)

var GENRES = []string{
	"pop", "rock", "country", "rap", "jazz", "romantic", "funk", "classical", "party",
}

func IndexGenre(track types.SpotifyTrack) (trackGenres []string) {

	artistPromptString := strings.Builder{}

	for _, artist := range track.Artists {
		artistPromptString.WriteString(fmt.Sprintf("- Artist %s:   \n", artist.Name))
	}

	artistString := artistPromptString.String()
	promptString := fmt.Sprintf(`You're a knowledgeable music genre specialist who has an expansive understanding of matching songs to their respective genres based on the artists involved. Your expertise lies in analyzing not only the artists' styles but also how they correlate with broader genre classifications. 

Your task is to determine the matching genres for the song "%s" based on the associated artists and their genres. Here are the details you need to consider:  

%s
From the following genre list, please select multiple genres that best match those of the provided artists: %s. Be sure to respond with the selected genres separated by commas, and refrain from including any additional information.`,
		track.Name, artistString, strings.Join(GENRES, ", "))

	client := api.NewApiClient("https://ai.arinji.com")
	headers := map[string]string{
		"Content-Type":  "application/json",
		"Authorization": os.Getenv("ACCESS_KEY"),
	}

	body := []map[string]string{
		{
			"role":    "user",
			"content": promptString,
		},
	}

	retries := 0
	maxRetries := 3

	for retries < maxRetries {
		res, status, err := client.SendRequestWithBody("POST", "/completions", body, headers)
		if status == 500 {
			fmt.Println("Server error, retrying...")
			retries++
			time.Sleep(time.Minute)
			continue
		}

		if err != nil && status != 500 {
			fmt.Println("Error with AI Request:", err)

			break
		}

		message, ok := res["message"].(string)
		if !ok {
			fmt.Println("Error converting message to string")
			return
		}
		genres := strings.Split(message, ",")

		for _, genre := range genres {
			genre = strings.ToLower(genre)
			genre = strings.TrimSpace(genre)
			if slices.Contains(GENRES, genre) {
				trackGenres = append(trackGenres, genre)
			}
		}

		return
	}

	fmt.Println("Failed to get a valid response after retries")

	return
}
