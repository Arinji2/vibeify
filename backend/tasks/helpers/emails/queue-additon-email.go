package email_helpers

import (
	_ "embed"
	"time"
)

//go:embed templates/queue-added.html
var queueAdditionEmailTemplateString string

func SendQueueAdditionEmail(isPremium bool, email string) {
	type emailDataType struct {
		IsPremium bool
		Year      int
	}

	emailData := emailDataType{
		IsPremium: isPremium,
		Year:      time.Now().Year(),
	}

	emailString := emailTemplateUtility(emailData, "Queue Addition Email", queueAdditionEmailTemplateString)
	emailClient := newEmailClient(
		email,
	)

	emailClient.SendEmail(
		"Your Convert Request Has Been Added to the Queue",
		emailString,
		"Queue Addition",
	)

}
