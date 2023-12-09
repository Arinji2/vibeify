import getSpotify from "@/utils/getSpotify";
import { CompareSchema } from "@/utils/validations/products/compare/schema";
import {
  ComparePlaylist,
  PocketbaseCompareData,
} from "@/utils/validations/products/compare/types";
import { PlaylistedTrack } from "@spotify/web-api-ts-sdk";
import { notFound } from "next/navigation";
import Pocketbase from "pocketbase";
import Results from "./results";
import Link from "next/link";
import Footer from "@/app/footer";

export async function generateMetadata({
  params,
}: {
  params: { link: string };
}) {
  const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  let parsedData: PocketbaseCompareData;
  try {
    const res = await pb
      .collection("compare")
      .getFirstListItem(`link = "${params.link}"`);

    const data = CompareSchema.parse(res);
    parsedData = data;
  } catch (e) {
    notFound();
  }
  let spotify, track1, track2;

  try {
    spotify = await getSpotify();

    track1 = await spotify.playlists.getPlaylist(parsedData.spotifyLink1);

    track2 = await spotify.playlists.getPlaylist(parsedData.spotifyLink2);
  } catch (e) {
    console.log("Error getting spotify data");
    notFound();
  }
  return {
    title: "Vibeify - Compare Results",
    description: `View the results of comparing ${track1.name} and ${track2.name} on Vibeify`,
  };
}
export default async function Page({ params }: { params: { link: string } }) {
  const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  let parsedData: PocketbaseCompareData;
  try {
    const res = await pb
      .collection("compare")
      .getFirstListItem(`link = "${params.link}"`);

    const data = CompareSchema.parse(res);
    parsedData = data;
  } catch (e) {
    notFound();
  }

  const spotify = await getSpotify();

  const track1 = await spotify.playlists.getPlaylist(parsedData.spotifyLink1);

  const track2 = await spotify.playlists.getPlaylist(parsedData.spotifyLink2);

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
    <section className="w-full md:min-h-excludeNav h-full bg-palette-accent flex flex-col items-center justify-center gap-4 py-2">
      <h1 className="text-white font-bold md:text-[60px] text-[55px] text-center">
        COMPARE RESULTS
      </h1>
      <Results
        urlParams={params.link}
        playlist1={formattedPlaylist1}
        playlist2={formattedPlaylist2}
      />

      <Footer />
    </section>
  );
}
