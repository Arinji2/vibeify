import getSpotify from "@/utils/getSpotify";
import { UserSchema } from "@/utils/validations/account/schema";
import {
  PlaylistSchema,
  ViewsSchema,
} from "@/utils/validations/playlists/schema";
import { TrackType } from "@/utils/validations/playlists/themes";
import { Metadata } from "next";
import {
  Cabin_Condensed,
  IBM_Plex_Mono,
  Press_Start_2P,
} from "next/font/google";
import Pocketbase from "pocketbase";
import { DefaultPage } from "./themes/default/server";
import { fetchTrackData } from "./utils";
import { NeoBrutalismPage } from "./themes/neo-brutalism/server";
import { PixelPage } from "./themes/pixel/server";
import { cookies, headers } from "next/headers";
import { revalidateTag, unstable_cache } from "next/cache";
import { useRouter } from "next/navigation";
import { CheckViews } from "./checkViews";

export async function generateMetadata({
  params,
}: {
  params: { playlistLink: string };
}): Promise<Metadata> {
  const playlistLink = params.playlistLink;

  const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  const data = await pb
    .collection("playlists")
    .getFirstListItem(`link = "${playlistLink}"`, {
      expand: "created_by",
    });

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
        `https://db-listify.arinji.com/api/files/playlists/${parsedPlaylistData.id}/${parsedPlaylistData.image}`,
      ],
    },

    openGraph: {
      images: [
        {
          url: `https://db-listify.arinji.com/api/files/playlists/${parsedPlaylistData.id}/${parsedPlaylistData.image}`,
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
}: {
  params: { playlistLink: string };
}) {
  const playlistLink = params.playlistLink;
  const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

  const data = await pb
    .collection("playlists")
    .getFirstListItem(`link = "${playlistLink}"`);

  const parsedPlaylistData = PlaylistSchema.parse(data);

  const userRecord = await pb
    .collection("users")
    .getOne(parsedPlaylistData.created_by);

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
      tags: ["viewsRecordPage"],
    }
  )();

  const parsedViewData = ViewsSchema.parse(viewRecord);

  const parsedUserData = UserSchema.parse(userRecord);
  const spotify = await getSpotify();
  const spotifyPlaylist = await spotify.playlists.getPlaylist(
    parsedPlaylistData.spotify_link.split("/")[4].split("?")[0]
  );

  const spotifyTracks = await spotify.playlists.getPlaylistItems(
    spotifyPlaylist.id,
    undefined,
    undefined,
    15,
    0
  );

  const trackPromises = spotifyTracks.items.map(fetchTrackData);

  const resolvedTracks = await Promise.all(trackPromises);

  const tracks = resolvedTracks.filter(
    (track) => track !== null
  ) as TrackType[];

  return (
    <>
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
    </>
  );
}
