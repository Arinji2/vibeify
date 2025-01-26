package custom_log

import (
	"github.com/gookit/slog"
	"github.com/gookit/slog/handler"
)

// Exported logger variable
var Logger *slog.Logger

func init() {
	// Define a custom log template with the call stack
	template := `[{{level}}] [{{caller}}] {{message}}
`

	// Create a new ConsoleHandler with the custom template
	h := handler.NewConsoleHandler(slog.AllLevels)
	h.Formatter().(*slog.TextFormatter).SetTemplate(template)

	// Initialize the logger with the custom handler
	Logger = slog.NewWithHandlers(h)
}
