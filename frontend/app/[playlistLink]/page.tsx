import getSpotify from "@/utils/getSpotify";
import { UserSchema } from "@/utils/validations/account/schema";
import {
  PlaylistSchema,
  ViewsSchema,
} from "@/utils/validations/playlists/schema";
import { TrackType } from "@/utils/validations/playlists/themes";
import { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import Pocketbase from "pocketbase";
import "react-lazy-load-image-component/src/effects/blur.css";
import Footer from "../footer";
import { CheckViews } from "./checkViews";
import { TestModeComponent } from "./testMode";
import { DefaultPage } from "./themes/default/server";
import { NeoBrutalismPage } from "./themes/neo-brutalism/server";
import { PixelPage } from "./themes/pixel/server";
import { fetchTrackData } from "./utils";

export async function generateMetadata({
  params,
}: {
  params: { playlistLink: string };
}): Promise<Metadata> {
  const playlistLink = params.playlistLink;

  const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  let data;
  try {
    data = await pb
      .collection("playlists")
      .getFirstListItem(`link = "${playlistLink}"`, {
        expand: "created_by",
      });
  } catch (e) {
    notFound();
  }

  const parsedPlaylistData = PlaylistSchema.parse(data);

  return {
    title: parsedPlaylistData.display_name + " | Vibeify",
    description: `View the playlist ${parsedPlaylistData.display_name} made by ${data.expand?.created_by.username} on Vibeify`,
    robots: {
      index: false,
      follow: false,
    },
    twitter: {
      card: "summary_large_image",
      site: "Vibeify",
      description: `View ${parsedPlaylistData.display_name} made by ${parsedPlaylistData.created_by} on Vibeify`,
      images: [
        `${process.env.NEXT_PUBLIC_POCKETBASE_URL}/api/files/playlists/${parsedPlaylistData.id}/${parsedPlaylistData.image}`,
      ],
    },

    openGraph: {
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_POCKETBASE_URL}/api/files/playlists/${parsedPlaylistData.id}/${parsedPlaylistData.image}`,
          width: 500,
          height: 500,
          alt: parsedPlaylistData.display_name,
        },
      ],
    },
  };
}
export default async function Page({
  params,
  searchParams,
}: {
  params: { playlistLink: string };
  searchParams: { testMode: string | undefined };
}) {
  const playlistLink = params.playlistLink;
  const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  let data;
  try {
    data = await pb
      .collection("playlists")
      .getFirstListItem(`link = "${playlistLink}"`);
  } catch (e) {
    console.error(e);
    notFound();
  }

  const parsedPlaylistData = PlaylistSchema.parse(data);
  let inTestMode = false;
  if (searchParams.testMode) {
    const testMode = searchParams.testMode.toLowerCase();
    if (
      testMode === "default" ||
      testMode === "neo-brutalism" ||
      testMode === "pixel"
    ) {
      parsedPlaylistData.theme = testMode;
      inTestMode = true;
    }
  }

  const userRecord = await unstable_cache(
    async (id) => {
      const userRecord = await pb.collection("users").getOne(id);
      return userRecord;
    },
    ["cache-key"],
    {
      tags: ["UsernameTag"],
    },
  )(parsedPlaylistData.created_by);

  if (!userRecord.email) userRecord.email = "";
  await CheckViews({ id: parsedPlaylistData.id! });
  const viewRecord = await unstable_cache(
    async () => {
      const viewRecord = await pb.collection("views").getFullList({
        filter: `playlist_id = "${parsedPlaylistData.id}"`,
      });
      return viewRecord;
    },
    ["cache-key"],
    {
      tags: [`views${parsedPlaylistData.id}`],
    },
  )();

  const parsedViewData = ViewsSchema.parse(viewRecord);

  const parsedUserData = UserSchema.parse(userRecord);
  const spotify = await getSpotify();
  const spotifyPlaylist = await spotify!.playlists.getPlaylist(
    parsedPlaylistData.spotify_link.split("/")[4].split("?")[0],
  );

  const spotifyTracks = await spotify!.playlists.getPlaylistItems(
    spotifyPlaylist.id,
    undefined,
    undefined,
    15,
    0,
  );

  const trackPromises = spotifyTracks.items.map(fetchTrackData);

  const resolvedTracks = await Promise.all(trackPromises);

  const tracks = resolvedTracks.filter(
    (track) => track !== null,
  ) as TrackType[];

  return (
    <>
      {inTestMode && (
        <TestModeComponent
          currentTheme={parsedPlaylistData.theme}
          link={parsedPlaylistData.link}
        />
      )}
      {parsedPlaylistData.theme === "default" && (
        <DefaultPage
          parsedPlaylistData={parsedPlaylistData}
          parsedUserData={parsedUserData}
          parsedViewData={parsedViewData}
          spotifyPlaylist={spotifyPlaylist}
          tracks={tracks}
        />
      )}
      {parsedPlaylistData.theme === "neo-brutalism" && (
        <NeoBrutalismPage
          parsedPlaylistData={parsedPlaylistData}
          parsedUserData={parsedUserData}
          parsedViewData={parsedViewData}
          spotifyPlaylist={spotifyPlaylist}
          tracks={tracks}
        />
      )}
      {parsedPlaylistData.theme === "pixel" && (
        <PixelPage
          parsedPlaylistData={parsedPlaylistData}
          parsedUserData={parsedUserData}
          parsedViewData={parsedViewData}
          spotifyPlaylist={spotifyPlaylist}
          tracks={tracks}
        />
      )}
      <div className="w-full h-fit flex flex-col items-center justify-center">
        <Footer full />
      </div>
    </>
  );
}
