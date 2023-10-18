import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getModel() {
  const cookie = cookies().get("pb_auth");
  if (!cookie) redirect("/login");

  const { model } = await JSON.parse(cookie.value);
  return model;
}
