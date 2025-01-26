"use server";

import getSpotify from "@/utils/getSpotify";
import { TrackType } from "@/utils/validations/playlists/themes";
import { Playlist } from "@spotify/web-api-ts-sdk";
import { fetchTrackData } from "./utils";

export async function FetchNextSongsAction(
  offset: number,
  playlistData: Playlist
) {
  const spotify = await getSpotify();

  const spotifyTracks = await spotify.playlists.getPlaylistItems(
    playlistData.id,
    undefined,
    undefined,
    25,
    offset * 50
  );

  const trackPromises = spotifyTracks.items.map(fetchTrackData);

  const resolvedTracks = await Promise.all(trackPromises);

  const tracks = resolvedTracks.filter(
    (track) => track !== null
  ) as TrackType[];

  return tracks;
}
