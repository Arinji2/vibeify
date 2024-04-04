"use server";

import { getToken } from "@/utils/getToken";
import { ThemesType } from "@/utils/validations/playlists/themes";
import { revalidatePath } from "next/cache";
import Pocketbase from "pocketbase";

export default async function UpdateThemeAction(
  playlistID: string,
  playlistLINK: string,
  theme: ThemesType
) {
  try {
    const token = await getToken();
    const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
    pb.authStore.save(token);
    await pb.collection("users").authRefresh();

    await pb.collection("playlists").update(playlistID, {
      theme: theme,
    });
    revalidatePath(`/playlist/${playlistID}`);
    revalidatePath(`/${playlistLINK}`);

    return { message: "Theme updated", status: 200 };
  } catch (e) {
    return { message: "Something went wrong", status: 500 };
  }
}
