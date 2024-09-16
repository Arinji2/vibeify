import getSpotify from "@/utils/getSpotify";
import {
  PlaylistSchema,
  SyncSchema,
} from "@/utils/validations/playlists/schema";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import Pocketbase from "pocketbase";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => {
    return NextResponse.json(
      { success: false, message: "Token Not Provided" },
      { status: 401, headers: { "content-type": "application/json" } }
    );
  });

  const runWeekly = body.cron ?? (false as boolean);
  if (!body || !body.id) {
    return NextResponse.json(
      { success: false, message: "Playlist ID Not Provided" },
      { status: 401, headers: { "content-type": "application/json" } }
    );
  }

  const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

  try {
    await pb.admins.authWithPassword(
      process.env.ADMIN_EMAIL!,
      process.env.ADMIN_PASSWORD!
    );

    const playlistRecord = await pb.collection("playlists").getOne(body.id);
    const playlistData = PlaylistSchema.safeParse(playlistRecord);
    if (!playlistData.success)
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 402, headers: { "content-type": "application/json" } }
      );
    const syncRecord = await pb
      .collection("sync")
      .getFirstListItem(`playlist = "${playlistData.data.id}"`);

    const syncData = SyncSchema.safeParse(syncRecord);
    if (!syncData.success)
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403, headers: { "content-type": "application/json" } }
      );

    const date = new Date();
    const syncedDate = new Date(syncData.data.updated);
    const diff = Math.abs(date.getTime() - syncedDate.getTime());
    revalidatePath("/dashboard/playlists");
    const remaining = Math.floor((600000 - diff) / 60000);

    if (diff < 600000)
      return NextResponse.json(
        {
          success: false,
          message: `Playlist Synced`,
          body: {
            remaining: remaining,
          },
        },
        { status: 405, headers: { "content-type": "application/json" } }
      );

    const spotify = await getSpotify();

    if (
      syncData.data.displayNameSync ||
      syncData.data.displayLinkSync ||
      syncData.data.displayPictureSync
    ) {
      await pb.collection("sync").update(syncData.data.id!, {
        updated: new Date().toISOString(),
      });
      const playlist = await spotify.playlists.getPlaylist(
        playlistData.data.spotify_link.split("/")[4]
      );

      if (syncData.data.displayNameSync)
        await pb
          .collection("playlists")
          .update(playlistData.data.id!, { display_name: playlist.name });
      if (syncData.data.displayLinkSync)
        await pb.collection("playlists").update(playlistData.data.id!, {
          display_link: playlist.external_urls.spotify,
        });
      if (syncData.data.displayPictureSync) {
        const formData = new FormData();
        const accessToken = await spotify.getAccessToken();

        let image = (await fetch(
          `https://api.spotify.com/v1/playlists/${playlist.id}/images`,
          {
            headers: {
              Authorization: `Bearer ${accessToken?.access_token}`,
              ContentType: "image/png",
            },
          }
        )) as any;
        image = await image.json();

        const fileData = await fetch(image[0].url, {
          headers: {
            "Content-Type": "image/png",
          },
        }).then((res) => res.blob());
        const blob = new Blob([fileData], { type: "image/png" });

        formData.append("image", blob, `${Math.random()}.png`);
        await pb
          .collection("playlists")
          .update(playlistData.data.id!, { image: formData.get("image") });
      }
    }
  } catch {
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }

  const playlistRecord = await pb.collection("playlists").getOne(body.id);
  const playlistData = PlaylistSchema.safeParse(playlistRecord);
  if (!playlistData.success)
    return NextResponse.json(
      { success: false, message: "Forbidden" },
      { status: 402, headers: { "content-type": "application/json" } }
    );

  revalidatePath(`/${playlistData.data.link}`);
  revalidatePath(`/dashboard/playlists/${playlistData.data.link}`);
  revalidatePath(`/dashboard/playlists`);
  return NextResponse.json(
    { success: true, message: "Playlist Synced" },
    { status: 200, headers: { "content-type": "application/json" } }
  );
}
