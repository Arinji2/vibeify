package types

type GenreArrays map[string][]GenreArray

type GenreArray struct {
	URI string `json:"uri"`
}

type IndexablePlaylist struct {
	Name string `json:"name"`
	Link string `json:"playlist_link"`
}
