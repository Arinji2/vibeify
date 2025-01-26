package types

type PocketbaseUser struct {
	Token  string               `json:"token"`
	Record PocketbaseUserRecord `json:"record"`
}

type PocketbaseUserRecord struct {
	ID       string `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Name     string `json:"name"`
	Premium  bool   `json:"premium"`
}

type PocketbaseLimit struct {
	Id   string `json:"id"`
	User string `json:"user"`
	Uses int    `json:"uses"`
}

type PocketbaseSongRecord struct {
	ID        string   `json:"id"`
	Genres    []string `json:"genres"`
	SpotifyID string   `json:"spotifyID"`
	Name      string   `json:"name"`
	TotalUses int      `json:"totalUses"`
}

type PocketbaseSongIndexQueue struct {
	Created   string `json:"created"`
	Id        string `json:"id"`
	SpotifyID string `json:"spotifyID"`
}

type PocketbaseCompareRecord struct {
	ID        string `json:"id"`
	Playlist1 string `json:"playlist1"`
	Playlist2 string `json:"playlist2"`
	User      string `json:"user"`
	Results   string `json:"results"`
}

type PocketbaseCompareResults struct {
	Common     []string `json:"common"`
	MissingIn1 []string `json:"missingIn1"`
	MissingIn2 []string `json:"missingIn2"`
}
