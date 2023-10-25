import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getToken() {
  const cookie = cookies().get("pb_auth")?.value!;
  if (!cookie) redirect("/login");

  const token = await JSON.parse(cookie).token;
  return token as string;
}
