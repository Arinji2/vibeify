"use server";

import getSpotify from "@/utils/getSpotify";
import { TrackSchema } from "@/utils/validations/playlists/schema";
import { TrackType } from "@/utils/validations/playlists/themes";
import { Playlist, PlaylistedTrack, Track } from "@spotify/web-api-ts-sdk";
import { getPlaiceholder } from "plaiceholder";

export async function FetchNextSongsAction(
  offset: number,
  playlistData: Playlist
) {
  const spotify = await getSpotify();

  const spotifyTracks = await spotify.playlists.getPlaylistItems(
    playlistData.id,
    undefined,
    undefined,
    50,
    offset * 50
  );

  const fetchTrackData = async (item: PlaylistedTrack) => {
    if ((item.track as Track).album.artists) {
      const buffer = await fetch(
        (item.track as Track).album.images[0].url
      ).then(async (res) => Buffer.from(await res.arrayBuffer()));

      const { base64 } = await getPlaiceholder(buffer);

      (item.track as unknown as TrackType).blurDataURL = base64;

      const parsedTrack = TrackSchema.parse(item.track);

      return parsedTrack as TrackType;
    } else {
      return null;
    }
  };

  const trackPromises = spotifyTracks.items.map(fetchTrackData);

  const resolvedTracks = await Promise.all(trackPromises);

  const tracks = resolvedTracks.filter(
    (track) => track !== null
  ) as TrackType[];

  return tracks;
}
