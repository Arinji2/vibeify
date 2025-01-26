package helpers

import (
	"fmt"

	email_helpers "github.com/Arinji2/vibeify-backend/tasks/helpers/emails"
	user_errors "github.com/Arinji2/vibeify-backend/user-errors"
)

func HandleError(err error, emailTo string) {

	userError, ok := err.(user_errors.UserError)
	if ok {
		readableError := userError.ReadableError()
		if emailTo != "" {

			email_helpers.SendQueueErrorEmail(readableError, emailTo)
			panic(err)

		}
		fmt.Println("ERROR IN TASK")
	}

	fmt.Println(err)
	panic(err)

}
