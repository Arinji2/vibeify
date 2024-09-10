"use server";

import { getToken } from "@/utils/getToken";
import Pocketbase from "pocketbase";

export async function DeleteCompareAction({ id }: { id: string }) {
  try {
    const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
    const token = await getToken();
    pb.authStore.save(token);

    await pb.collection("users").authRefresh();
    const res = await pb.collection("compareList").delete(id);
    if (res) return { success: true, message: "Compare Deleted", status: 200 };
    return { success: false, message: "Compare Not Deleted", status: 400 };
  } catch (e) {
    console.log(e);
    return { success: false, message: "Compare Not Deleted", status: 400 };
  }
}
