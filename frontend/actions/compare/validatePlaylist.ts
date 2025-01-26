"use server";

import getSpotify from "@/utils/getSpotify";

export default async function ValidatePlaylistAction(playlistLink: string) {
  const playlist_id = playlistLink.split("/")[4];

  const spotify = await getSpotify();
  let data;
  try {
    data = await spotify.playlists.getPlaylist(playlist_id.split("?")[0]);
  } catch (e) {
    return { message: "Invalid Spotify Link", status: 400 };
  }

  if (data.tracks.total > 400) {
    return {
      message:
        "Playlist is too big, Maximum Songs for playlists can only be 400 tracks. ",
      status: 400,
    };
  }

  return { message: "Valid Playlist", status: 200 };
}
