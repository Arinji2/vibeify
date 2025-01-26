package pocketbase_helpers

import (
	"fmt"

	"github.com/Arinji2/vibeify-backend/api"
)

func UpdateUses(id string, totalUses int) {
	client := api.NewApiClient()
	adminToken := GetPocketbaseAdminToken()

	client.SendRequestWithBody("PATCH", fmt.Sprintf("/api/collections/songs/records/%s", id), map[string]string{
		"totalUses": fmt.Sprintf("%d", totalUses+1),
	}, map[string]string{
		"Authorization": adminToken,
	})

}
