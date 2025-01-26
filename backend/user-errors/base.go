package user_errors

type UserError struct {
	displayMessage string
	loggingError   error
}

func (e UserError) ReadableError() string {
	return e.displayMessage
}

func (e UserError) Error() string {
	return e.loggingError.Error()
}

func NewUserError(displayMessage string, loggingError error) error {
	if displayMessage == "" {
		displayMessage = "server ^error"
	}
	return UserError{
		displayMessage: displayMessage,
		loggingError:   loggingError,
	}
}
