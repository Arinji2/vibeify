import { NextRequest, NextResponse } from "next/server";
import Pocketbase from "pocketbase";

export async function POST(req: NextRequest) {
  if (
    req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json(
      { success: false, message: "Forbidden" },
      { status: 403, headers: { "content-type": "application/json" } }
    );
  }
  const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

  await pb.admins.authWithPassword(
    process.env.ADMIN_EMAIL!,
    process.env.ADMIN_PASSWORD!
  );

  const playlists = await pb.collection("playlists").getFullList();

  playlists.forEach(async (playlist) => {
    await fetch(`https://vibeify.xyz/playlists/sync`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: playlist.id, cron: true }),
    });
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
