import { cookies } from "next/headers";

export async function getModel() {
  const cookie = cookies().get("pb_auth");
  if (!cookie) throw new Error("Not logged in");

  const { model } = await JSON.parse(cookie.value);
  return model;
}
