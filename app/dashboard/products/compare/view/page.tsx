import getSpotify from "@/utils/getSpotify";
import { ComparePlaylist } from "@/utils/validations/products/compare/types";
import { PlaylistedTrack } from "@spotify/web-api-ts-sdk";
import { redirect } from "next/navigation";
import Results from "./results";
import Link from "next/link";
import { Share } from "./client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Results | Vibeify Products",
  description: "View the Results of the Playlist Comparison!",
};
export default async function Page({
  searchParams,
}: {
  searchParams: { [ids: string]: string | undefined };
}) {
  if (!searchParams.ids) redirect("/dashboard/products");
  const spotifyIDS = searchParams.ids.split(",");
  if (spotifyIDS.length !== 2 || !Array.isArray(spotifyIDS))
    redirect("/dashboard/products");

  const spotify = await getSpotify();

  const track1 = await spotify.playlists.getPlaylist(
    spotifyIDS[0].split("?")[0]
  );

  const track2 = await spotify.playlists.getPlaylist(
    spotifyIDS[1].split("?")[0]
  );

  if (!track1.tracks.items || !track2.tracks.items)
    redirect("/dashboard/products");

  function getImage(item: PlaylistedTrack) {
    //@ts-expect-error
    if (item.track.album.images[0] === undefined) return "";
    //@ts-expect-error
    else return item.track.album.images[0].url;
  }

  let formattedPlaylist1 = track1.tracks.items.map((item) => ({
    id: item.track.id,
    name: item.track.name,
    image: getImage(item),
    link: item.track.external_urls.spotify,
  })) as ComparePlaylist[];

  formattedPlaylist1 = formattedPlaylist1.filter((item) => item.name !== "");
  let formattedPlaylist2 = track2.tracks.items.map((item) => ({
    id: item.track.id,
    name: item.track.name,
    image: getImage(item),
    link: item.track.external_urls.spotify,
  })) as ComparePlaylist[];

  formattedPlaylist2 = formattedPlaylist2.filter((item) => item.name !== "");

  return (
    <div className="w-full md:min-h-excludeNav h-full bg-palette-accent flex flex-col items-center justify-center gap-4 py-2">
      <h1 className="text-white font-bold md:text-[60px] text-[55px] text-center">
        COMPARE RESULTS
      </h1>
      <Results
        urlParams={searchParams.ids}
        playlist1={formattedPlaylist1}
        playlist2={formattedPlaylist2}
      />
      <div className="w-fit h-fit p-5 text-center flex flex-col items-center justify-center gap-2 rounded-md bg-palette-background border-[4px] border-black shadow-button">
        <Share
          playlistID1={spotifyIDS[0].split("?")[0]}
          playlistID2={spotifyIDS[1].split("?")[0]}
        />
        <Link
          href="/dashboard/products"
          className="text-xl font-bold text-palette-text border-b-2 border-black"
        >
          Go Back to Products
        </Link>
      </div>
    </div>
  );
}
