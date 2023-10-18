"use client";
import Pocketbase from "pocketbase";
import { OauthAction } from "./server";

export async function GoogleOauth() {
  const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

  const { token, record: model } = await pb
    .collection("users")
    .authWithOAuth2({ provider: "google" });

  const res = await OauthAction(token, model);
  if (res.status !== 200) throw new Error(res.message);
  else return res.status;
}

export async function GithubOauth() {
  const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

  const { token, record: model } = await pb
    .collection("users")
    .authWithOAuth2({ provider: "github" });

  const res = await OauthAction(token, model);
  if (res.status !== 200) throw new Error(res.message);
  else return res.status;
}
