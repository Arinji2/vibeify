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

export async function generateStaticParams() {
  const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  const links = await pb.collection("compare").getFullList();

  return links.map((link) => ({
    link: link.link,
  }));
}

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

      <div className="w-[95%] md:w-[70%] h-fit p-2 py-4 bg-palette-background flex flex-col items-center gap-5 justify-center rounded-md shadow-button border-[4px] border-black">
        <h2 className="text-5xl font-bold text-palette-accent ">VIBEIFY</h2>
        <section className="flex h-fit w-full flex-row flex-wrap items-center justify-center gap-[33px] md:flex-nowrap">
          <div className="flex h-fit w-fit flex-row items-center justify-center gap-[11px]">
            <div className="h-[17px] w-[17px] rounded-full bg-palette-primary"></div>
            <h3 className="text-[20px] font-medium text-palette-text md:text-[30px]">
              Showcase
            </h3>
          </div>
          <div className="flex h-fit w-fit flex-row items-center justify-center gap-[11px]">
            <div className="h-[17px] w-[17px] rounded-full bg-palette-primary"></div>
            <h3 className="text-[20px] font-medium text-palette-text md:text-[30px]">
              Compare
            </h3>
          </div>
          <div className="flex h-fit w-fit flex-row items-center justify-center gap-[11px]">
            <div className="h-[17px] w-[17px] rounded-full bg-palette-primary"></div>
            <h3 className="text-[20px] font-medium text-palette-text md:text-[30px]">
              Convert
            </h3>
          </div>
        </section>

        <Link
          href="/"
          className="w-full flex flex-row items-center justify-center gap-2"
        >
          <p className="text-2xl font-medium text-black">Intrested?</p>
          <p className="text-3xl font-bold text-palette-secondary border-b-2 border-black">
            Check Us Out!
          </p>
        </Link>
      </div>
    </section>
  );
}
