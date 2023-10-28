import { NextRequest, NextResponse } from "next/server";
import Pocketbase from "pocketbase";

export async function POST(req: NextRequest) {
  const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

  await pb.admins.authWithPassword(
    process.env.ADMIN_EMAIL!,
    process.env.ADMIN_PASSWORD!
  );

  const playlists = await pb.collection("playlists").getFullList();

  playlists.forEach(async (playlist) => {
    const res = await fetch(`https://vibeify.xyz/playlists/sync`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: playlist.id, cron: true }),
    });
    console.log(res);
  });

  return new Response(
    JSON.stringify({ success: true, message: "Syncing All Playlists" }),
    {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    }
  );
}
