package compare

import (
	"encoding/json"
	"errors"
	"fmt"

	"github.com/Arinji2/vibeify-backend/api"
	custom_log "github.com/Arinji2/vibeify-backend/logger"
	pocketbase_helpers "github.com/Arinji2/vibeify-backend/tasks/helpers/pocketbase"
	spotify_helpers "github.com/Arinji2/vibeify-backend/tasks/helpers/spotify"
	"github.com/Arinji2/vibeify-backend/types"
)

func AddToDb(user types.PocketbaseUser, taskData types.CompareTaskType) bool {
	client := api.NewApiClient()
	adminToken := pocketbase_helpers.GetPocketbaseAdminToken()
	playlist1ID := spotify_helpers.CleanupID(taskData.Playlist1)
	playlist2ID := spotify_helpers.CleanupID(taskData.Playlist2)

	_, _, err := client.SendRequestWithBody("POST", "/api/collections/compareList/records", map[string]string{
		"playlist1": playlist1ID,
		"playlist2": playlist2ID,
		"user":      user.Record.ID,
	}, map[string]string{
		"Authorization": adminToken,
	})

	if err != nil {
		fmt.Println("Error: Adding to DB")
		return false
	}

	custom_log.Logger.Debug("Added New Compare to DB")
	return true
}

func GetDbData(user types.PocketbaseUser) (*types.PocketbaseCompareRecord, error) {
	client := api.NewApiClient()
	adminToken := pocketbase_helpers.GetPocketbaseAdminToken()
	res, _, err := client.SendRequestWithQuery("GET", "/api/collections/compareList/records", map[string]string{
		"page":    "1",
		"perPage": "1",
		"filter":  fmt.Sprintf(`user="%s" && results=null`, user.Record.ID),
	}, map[string]string{
		"Authorization": adminToken,
	})

	if err != nil {
		fmt.Println("Error: Compare not found")
		return nil, err
	}

	items, ok := res["items"].([]interface{})
	if !ok {
		fmt.Println("Error: Items not found")
		return nil, errors.New("items not found")
	}

	jsonRes, err := json.Marshal(items[0])
	if err != nil {
		fmt.Println("Error: Marshal")
		return nil, err
	}

	var compareRecord types.PocketbaseCompareRecord
	err = json.Unmarshal(jsonRes, &compareRecord)
	if err != nil {
		fmt.Println("Error: Unmarshal")
		return nil, err
	}

	return &compareRecord, nil
}

func UpdateDBWithResults(user types.PocketbaseUser, results types.PocketbaseCompareResults, recordID string) bool {
	client := api.NewApiClient()
	adminToken := pocketbase_helpers.GetPocketbaseAdminToken()
	jsonResults, err := json.Marshal(results)
	if err != nil {
		fmt.Println("Error: Marshal")
		return false
	}

	_, _, err = client.SendRequestWithBody("PATCH", fmt.Sprintf("/api/collections/compareList/records/%s", recordID), map[string]string{
		"results": string(jsonResults),
	}, map[string]string{
		"Authorization": adminToken,
	})

	if err != nil {
		fmt.Println("Error: Updating to DB")
		return false
	}
	return true

}
