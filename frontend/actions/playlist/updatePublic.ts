"use server";
import { getToken } from "@/utils/getToken";
import { PlaylistSchema } from "@/utils/validations/playlists/schema";
import { revalidatePath, revalidateTag } from "next/cache";
import Pocketbase from "pocketbase";

export async function UpdatePublicAction(formData: FormData) {
  try {
    const token = await getToken();
    const playlistID = formData.get("playlistID") as string;
    const publicPlaylist =
      formData.get("publicPlaylist") === "1" ? true : false;

    const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
    pb.authStore.save(token);
    await pb.collection("users").authRefresh();

    const res = await pb.collection("playlists").update(playlistID, {
      public: publicPlaylist,
    });

    const parsedRes = PlaylistSchema.safeParse(res);
    if (!parsedRes.success)
      return { message: "Something went wrong", status: 500 };

    revalidatePath(`/dashboard/playlists/${playlistID}`);
    revalidatePath(`/dashboard/playlists/${playlistID}/edit`);
    revalidatePath(`/${parsedRes.data.link}`);

    return { message: "Public Updated", status: 200 };
  } catch (e) {
    return { message: "Something went wrong", status: 500 };
  }
}
