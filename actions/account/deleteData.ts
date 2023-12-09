"use server";
import { getToken } from "@/utils/getToken";
import { PlaylistsSchema } from "@/utils/validations/playlists/schema";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import Pocketbase from "pocketbase";
export default async function DeleteDataAction() {
  const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  const token = await getToken();
  pb.authStore.save(token);
  await pb.collection("users").authRefresh();

  try {
    const playlistRecords = await pb.collection("playlists").getFullList({
      filter: `created_by = "${pb.authStore.model!.id}"`,
    });

    const parsedPlaylistRecords = PlaylistsSchema.parse(playlistRecords);

    await Promise.all(
      parsedPlaylistRecords.map(async (playlist) => {
        await pb.collection("playlists").delete(playlist.id!);

        revalidatePath(`/account/playlists`);
        revalidatePath(`/account/playlists/${playlist.id}`);
        revalidatePath(`/${playlist.link}`);
      })
    );

    await pb.collection("users").delete(pb.authStore.model!.id!);

    cookies().delete("pb_auth");

    return {
      status: 200,
      message: "Playlists deleted",
    };
  } catch (e) {
    console.log(e);
    return {
      status: 500,
      message: "something went wrong",
    };
  }
}
