"use server";
import { getModel } from "@/utils/getModel";
import { getToken } from "@/utils/getToken";
import { revalidatePath, revalidateTag } from "next/cache";
import Pocketbase from "pocketbase";
export default async function SaveAccountIconAction(
  initialState: any,
  formData: FormData
) {
  const form = {
    seed: formData.get("seed") as string,
  };

  const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  const token = await getToken();
  const model = await getModel();
  pb.authStore.save(token);
  try {
    pb.collection("users").update(model.id, {
      dicebear: form.seed,
    });
    revalidateTag("dashboardLayout");
    return { message: "Icon saved successfully", status: 200 };
  } catch (e) {
    return { message: "Error in saving Icon", status: 400 };
  }
}
