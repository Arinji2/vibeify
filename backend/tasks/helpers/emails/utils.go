package email_helpers

import (
	"log"
	"strings"

	"html/template"
)

func emailTemplateUtility(data any, emailName string, emailString string) string {
	tmpl, err := template.New(emailName).Parse(emailString)
	if err != nil {
		log.Fatalf("Error parsing template for email <%s>: %v", emailName, err)
	}

	finalEmail := &strings.Builder{}

	err = tmpl.Execute(finalEmail, data)
	if err != nil {
		log.Fatalf("Error executing template for email <%s>: %v", emailName, err)
	}

	return finalEmail.String()
}
