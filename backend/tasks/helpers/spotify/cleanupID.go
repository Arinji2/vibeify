package spotify_helpers

import "strings"

func CleanupID(id string) string {
	cleanedString := ""
	if strings.Contains(id, "/") {
		cleanedString = strings.Split(id, "/")[4]

	} else {
		cleanedString = id
	}
	if strings.Contains(cleanedString, "?") {
		cleanedString = strings.Split(cleanedString, "?")[0]
	}
	return cleanedString
}
