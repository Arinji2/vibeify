package compare

import (
	"fmt"
	"sync"

	custom_log "github.com/Arinji2/vibeify-backend/logger"
	spotify_helpers "github.com/Arinji2/vibeify-backend/tasks/helpers/spotify"
	"github.com/Arinji2/vibeify-backend/types"
)

func CompareTask(user types.PocketbaseUser, taskData types.CompareTaskType) {
	data, err := GetDbData(user)
	if err != nil {
		fmt.Println("Error: No Data")
		return
	}
	common, missingIn1, missingIn2 := ComparePlaylists(*data)
	var results types.PocketbaseCompareResults
	results.Common = common
	results.MissingIn1 = missingIn1
	results.MissingIn2 = missingIn2

	updatedDB := UpdateDBWithResults(user, results, data.ID)
	if !updatedDB {
		fmt.Println("Error: Updating DB")
		return
	}

	custom_log.Logger.Debug("Compare Task Completed for User: ", user.Record.Username)

}

func ComparePlaylists(data types.PocketbaseCompareRecord) (common []string, missingIn1 []string, missingIn2 []string) {

	fields := "id,name,tracks.items(track(id,name)),tracks.total,tracks.offset,tracks.limit"

	Playlist1, _, _ := spotify_helpers.GetSpotifyPlaylist(data.Playlist1, nil, fields)
	Playlist2, _, _ := spotify_helpers.GetSpotifyPlaylist(data.Playlist2, nil, fields)

	commonMap := make(map[string]struct{})
	missingIn1Map := make(map[string]struct{})
	missingIn2Map := make(map[string]struct{})

	set1 := make(map[string]struct{})
	set2 := make(map[string]struct{})

	for _, trackItem := range Playlist1 {
		set1[trackItem.Track.ID] = struct{}{}
	}

	for _, trackItem := range Playlist2 {
		set2[trackItem.Track.ID] = struct{}{}
	}

	var mu sync.Mutex
	wg := sync.WaitGroup{}
	chunkSize := 50

	processChunk := func(start, end int) {
		defer wg.Done()
		for i := start; i < end; i++ {
			id1 := Playlist1[i].Track.ID

			mu.Lock()
			if _, foundIn2 := set2[id1]; foundIn2 {
				commonMap[id1] = struct{}{}
			} else {
				missingIn2Map[id1] = struct{}{}
			}
			mu.Unlock()
		}
	}

	for i := 0; i < len(Playlist1); i += chunkSize {
		end := i + chunkSize
		if end > len(Playlist1) {
			end = len(Playlist1)
		}
		wg.Add(1)
		go processChunk(i, end)
	}

	processChunk2 := func(start, end int) {
		defer wg.Done()
		for i := start; i < end; i++ {
			id2 := Playlist2[i].Track.ID

			mu.Lock()
			if _, foundIn1 := set1[id2]; !foundIn1 {
				missingIn1Map[id2] = struct{}{}
			}
			mu.Unlock()
		}
	}

	for i := 0; i < len(Playlist2); i += chunkSize {
		end := i + chunkSize
		if end > len(Playlist2) {
			end = len(Playlist2)
		}
		wg.Add(1)
		go processChunk2(i, end)
	}

	wg.Wait()

	for id := range commonMap {
		if len(id) == 0 {
			continue
		}
		common = append(common, id)
	}
	for id := range missingIn1Map {
		if len(id) == 0 {
			continue
		}
		missingIn1 = append(missingIn1, id)
	}
	for id := range missingIn2Map {
		if len(id) == 0 {
			continue
		}
		missingIn2 = append(missingIn2, id)
	}

	return common, missingIn1, missingIn2
}
