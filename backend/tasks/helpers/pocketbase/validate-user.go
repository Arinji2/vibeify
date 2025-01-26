package pocketbase_helpers

import (
	"encoding/json"
	"fmt"

	"github.com/Arinji2/vibeify-backend/api"
	user_errors "github.com/Arinji2/vibeify-backend/user-errors"

	"github.com/Arinji2/vibeify-backend/types"
)

func ValidateUser(token string) (user *types.PocketbaseUser, error error) {

	client := api.NewApiClient()
	res, _, err := client.SendRequestWithBody("POST", "/api/collections/users/auth-refresh", nil, map[string]string{
		"Authorization": token,
	})

	if err != nil {

		return nil, user_errors.NewUserError("invalid user", err)
	}
	data, err := json.Marshal(res["record"])
	if err != nil {
		fmt.Println("Marshalling Error", err)

		return nil, user_errors.NewUserError("", err)

	}

	record := types.PocketbaseUserRecord{}

	err = json.Unmarshal(data, &record)

	if err != nil {
		fmt.Println("Error in parsing", err)

		return nil, user_errors.NewUserError("", err)
	}

	pocketbaseUser := types.PocketbaseUser{
		Token:  token,
		Record: record,
	}

	if pocketbaseUser.Record.Email == "" {
		return nil, user_errors.NewUserError("invalid user", err)
	}

	return &pocketbaseUser, nil

}
