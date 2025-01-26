"use server";

import { ViewsSchema } from "@/utils/validations/playlists/schema";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import Pocketbase from "pocketbase";

export async function CheckViews({ id }: { id: string }) {
  const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  const headersStore = headers();
  const viewerIP = headersStore.get("X-Forwarded-For");

  if (viewerIP) {
    const prevViews = await pb.collection("views").getFullList({
      filter: `ip = "${viewerIP}"`,
    });
    const parsedPrevViews = ViewsSchema.parse(prevViews);
    const prevView = parsedPrevViews.find((view) => view.playlist_id === id);

    if (!prevView) {
      await pb.collection("views").create({
        ip: viewerIP,
        playlist_id: id,
      });
      revalidateTag(`views${id}`);
    }
  }
}
