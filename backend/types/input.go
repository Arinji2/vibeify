package types

type AddTaskType struct {
	SpotifyURL string   `json:"spotifyURL"`
	UserToken  string   `json:"userToken"`
	Genres     []string `json:"genres"`
}

type CompareTaskType struct {
	Playlist1 string `json:"playlist1"`
	Playlist2 string `json:"playlist2"`
	UserToken string `json:"userToken"`
}
