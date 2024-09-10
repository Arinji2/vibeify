"use server";

import getSpotify from "@/utils/getSpotify";
import { getToken } from "@/utils/getToken";
import { PlaylistsSchema } from "@/utils/validations/playlists/schema";
import Pocketbase from "pocketbase";

export async function AddToCompare({
  playlist1,
  playlist2,
}: {
  playlist1: string;
  playlist2: string;
}) {
  try {
    const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
    const token = await getToken();
    pb.authStore.save(token);

    await pb.collection("users").authRefresh();
    const playlist1Record = await pb.collection("playlists").getOne(playlist1);
    const playlist2Record = await pb.collection("playlists").getOne(playlist2);

    const parsedPlaylists = PlaylistsSchema.parse([
      playlist1Record,
      playlist2Record,
    ]);
    if (parsedPlaylists[0].created_by !== parsedPlaylists[1].created_by)
      return {
        success: false,
        message: "Playlists are not from the current user",
        status: 400,
      };
    if (!parsedPlaylists[0].created_by === pb.authStore.model!.id)
      return {
        success: false,
        message: "Playlists are not from the current user",
        status: 400,
      };
    const spotify = await getSpotify();

    const playlist1ID = parsedPlaylists[0]
      .spotify_link!.split("/")[4]
      .split("?")[0];
    const playlist2ID = parsedPlaylists[1]
      .spotify_link!.split("/")[4]
      .split("?")[0];

    const spotifyplaylist1 = await spotify.playlists.getPlaylist(playlist1ID);
    const spotifyplaylist2 = await spotify.playlists.getPlaylist(playlist2ID);

    if (spotifyplaylist1.tracks.total > 400)
      return {
        success: false,
        message: `${parsedPlaylists[0].name} has more than 400 songs`,
        status: 400,
      };
    if (spotifyplaylist2.tracks.total > 400)
      return {
        success: false,
        message: `${parsedPlaylists[1].name} has more than 400 songs`,
        status: 400,
      };

    const res = await fetch("https://api-vibeify.arinji.com/compare", {
      method: "POST",
      body: JSON.stringify({
        playlist1: playlist1ID,
        playlist2: playlist2ID,
        userToken: token,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res) return { success: true, message: "Compare Deleted", status: 200 };
    return { success: false, message: "Compare Not Deleted", status: 400 };
  } catch (e) {
    console.log(e);
    return { success: false, message: "Compare Not Deleted", status: 400 };
  }
}
