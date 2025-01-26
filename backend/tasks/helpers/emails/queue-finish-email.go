package email_helpers

import (
	_ "embed"
	"time"

	"github.com/Arinji2/vibeify-backend/types"
)

//go:embed templates/queue-finished.html
var queueFinishEmailTemplateString string

func SendQueueFinishEmail(isPrem bool, uses int, items []types.QueueFinishedEmailItems, email string) {

	type emailDataType struct {
		Uses  int
		Total int
		Items []types.QueueFinishedEmailItems
		Year  int
	}

	total := 0

	if isPrem {
		total = 10
	} else {
		total = 5
	}

	emailData := emailDataType{
		Uses:  uses,
		Total: total,
		Items: items,
		Year:  time.Now().Year(),
	}

	emailString := emailTemplateUtility(emailData, "Queue Finished Email", queueFinishEmailTemplateString)
	emailClient := newEmailClient(
		email,
	)

	emailClient.SendEmail(
		"Your Convert Request Has Completed",
		emailString,
		"Queue Finished",
	)

}
