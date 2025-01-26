package pocketbase_helpers

import (
	"fmt"

	"github.com/Arinji2/vibeify-backend/api"
	"github.com/Arinji2/vibeify-backend/types"
	user_errors "github.com/Arinji2/vibeify-backend/user-errors"
)

func UpdateLimit(user *types.PocketbaseUser, used int, usesID string) error {
	adminToken := GetPocketbaseAdminToken()

	client := api.NewApiClient()
	_, status, error := client.SendRequestWithBody("PATCH", fmt.Sprintf("/api/collections/convertLimit/records/%s", usesID), map[string]string{
		"uses": fmt.Sprintf("%d", used+1),
		"user": user.Record.ID,
	}, map[string]string{
		"Authorization": adminToken,
	})

	if status == 404 {
		client.SendRequestWithBody("POST", "/api/collections/convertLimit/records", map[string]string{
			"uses": fmt.Sprintf("%d", used+1),
			"user": user.Record.ID,
		}, map[string]string{
			"Authorization": adminToken,
		})
	}

	if error != nil {

		return user_errors.NewUserError("", error)
	}

	return nil
}
