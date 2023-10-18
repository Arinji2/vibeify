"use server";

import { cookies } from "next/headers";
import { default as Pocketbase, RecordModel } from "pocketbase";

export async function OauthAction(token: string, model: RecordModel) {
  const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  try {
    const cookie = JSON.stringify({ token, model });

    cookies().set("pb_auth", cookie, {
      secure: true,
      path: "/",
      sameSite: "strict",
      httpOnly: true,
    });
  } catch (error: any) {
    console.log(error);
    return {
      status: 400,
      message: error.message,
    };
  }

  return {
    status: 200,
    message: "Logged in Successfully",
  };
}
