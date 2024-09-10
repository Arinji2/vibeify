"use server";

import { getToken } from "@/utils/getToken";
import Pocketbase from "pocketbase";

export async function ShareCompareAction({
  id,
  link,
}: {
  id: string;
  link: string;
}) {
  try {
    const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
    const token = await getToken();
    pb.authStore.save(token);

    await pb.collection("users").authRefresh();

    try {
      await pb
        .collection("compareList")
        .getFirstListItem(`shareLink = "${link}"`);

      return { success: false, message: "Link Taken", status: 409 };
    } catch (e) {}

    await pb.collection("compareList").update(id, {
      shareLink: link,
    });

    return { success: true, message: "Compare Shared", status: 200 };
  } catch (e) {
    console.log(e);
    return { success: false, message: "Compare Not Shared", status: 400 };
  }
}
