import getSpotify from "@/utils/getSpotify";
import { Playlist, Track } from "@spotify/web-api-ts-sdk";
import { unstable_cache } from "next/cache";
import { LoaderSongCard, SongCard } from "./song-card";
import { SongSectionUI } from "./song-section.client";

export async function SongSection({
  playlist,
  compareData,
  isCommon,
}: {
  playlist: Playlist<Track>;
  compareData: string[];
  isCommon?: boolean;
}) {
  let fetchedCompareData: Track[] = [];
  const spotify = await getSpotify();

  fetchedCompareData = await unstable_cache(
    async () => {
      let batchPromises: Promise<Track[]>[] = [];

      for (let i = 0; i < compareData.length; i += 50) {
        const batch = compareData.slice(i, i + 50);
        batchPromises.push(
          spotify.tracks.get(batch).then((tracksData) => {
            return tracksData.filter(
              (track: Track) =>
                !track.is_local && track.album.images[0] !== undefined
            );
          })
        );
      }

      const allBatches = await Promise.all(batchPromises);
      return allBatches.flat();
    },
    [compareData.join(",")],
    {
      revalidate: 60 * 60,
    }
  )();

  return (
    <SongSectionUI
      playlist={playlist}
      totalSongs={compareData.length}
      isCommon={isCommon}
    >
      {fetchedCompareData.map((item, index) => {
        return <SongCard key={item.id} item={item} index={index} />;
      })}
    </SongSectionUI>
  );
}

export async function LoaderSongSection({
  playlist,
  compareData,
  isCommon,
}: {
  playlist: Playlist<Track>;
  compareData: string[];
  isCommon?: boolean;
}) {
  return (
    <SongSectionUI
      playlist={playlist}
      totalSongs={compareData.length}
      isCommon={isCommon}
    >
      {compareData.map((item, index) => {
        return <LoaderSongCard key={index} index={index} />;
      })}
    </SongSectionUI>
  );
}
