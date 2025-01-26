"use server";

import { getToken } from "@/utils/getToken";
import Pocketbase from "pocketbase";
import { revalidateTag } from "next/cache";

export async function ChangeUsernameAction({ username }: { username: string }) {
  const token = await getToken();
  const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  pb.authStore.save(token);
  await pb.collection("users").authRefresh();

  let res = {
    status: 0,
    newUsername: username,
  };

  try {
    const data = await pb.collection("users").update(pb.authStore.model!.id, {
      username,
    });
    res.newUsername = data.username;
    res.status = 200;
    revalidateTag(`UsernameTag`);
    return res;
  } catch (er: any) {
    res.status = er.status;
    return res;
  }
}
