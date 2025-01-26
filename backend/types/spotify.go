package types

type SpotifyPlaylist struct {
	ID   string `json:"id"`
	Name string `json:"name"`

	Tracks SpotifyPlaylistTracks `json:"tracks"`
}

type SpotifyPlaylistTracks struct {
	Offset int                   `json:"offset"`
	Limit  int                   `json:"limit"`
	Total  int                   `json:"total"`
	Items  []SpotifyPlaylistItem `json:"items"`
}

type SpotifyPlaylistItem struct {
	AddedAt string       `json:"added_at"`
	Track   SpotifyTrack `json:"track"`
}

type SpotifyTrack struct {
	ID      string          `json:"id"`
	Name    string          `json:"name"`
	Artists []SpotifyArtist `json:"artists"`
	Album   SpotifyAlbum    `json:"album"`
	URI     string          `json:"uri"`
	IsLocal bool            `json:"is_local"`
}

type SpotifyArtist struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type SpotifyAlbum struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type SpotifyTrackForIndexing struct {
	Track   SpotifyTrack
	Artists struct {
		Data []SpotifyArtist
		IDS  []string
	}
	Genres []string
}
