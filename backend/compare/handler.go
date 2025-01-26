package compare

import (
	"encoding/json"
	"fmt"
	"net/http"

	pocketbase_helpers "github.com/Arinji2/vibeify-backend/tasks/helpers/pocketbase"
	"github.com/Arinji2/vibeify-backend/types"
)

func CompareHandler(w http.ResponseWriter, r *http.Request) {
	var requestBody types.CompareTaskType

	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()

	if err := decoder.Decode(&requestBody); err != nil {
		fmt.Println(err)
		http.Error(w, "Invalid Input", http.StatusBadRequest)
		return
	}

	fmt.Println(requestBody)

	user, err := pocketbase_helpers.ValidateUser(requestBody.UserToken)
	if err != nil {
		http.Error(w, "Invalid User Token", http.StatusUnauthorized)
		return
	}

	hasExistingCompare := CheckExistingCompares(*user)
	if hasExistingCompare {
		http.Error(w, "Compare Already Exists", http.StatusBadRequest)
		return
	}
	similarCompares := CheckIfCompareExists(*user, requestBody)
	if similarCompares {
		http.Error(w, "Similar Compare Already Exists", http.StatusBadRequest)
		return
	}

	addedToDb := AddToDb(*user, requestBody)
	if !addedToDb {
		http.Error(w, "Error Adding to DB", http.StatusBadRequest)
		return
	}

	go CompareTask(*user, requestBody)

	w.Write([]byte("Success"))

}
