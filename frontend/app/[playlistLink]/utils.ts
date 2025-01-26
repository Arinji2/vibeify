import { TrackSchema } from "@/utils/validations/playlists/schema";
import { TrackType } from "@/utils/validations/playlists/themes";
import { PlaylistedTrack, Track } from "@spotify/web-api-ts-sdk";

export const fetchTrackData = async (item: PlaylistedTrack) => {
  if ((item.track as Track).album.artists) {
    const parsedTrack = TrackSchema.parse(item.track);

    return parsedTrack as TrackType;
  } else {
    return null;
  }
};
