import { getToken } from "@/utils/getToken";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import Pocketbase from "pocketbase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => {
      return NextResponse.json(
        { success: false, message: "Token Not Provided" },
        { status: 401, headers: { "content-type": "application/json" } }
      );
    });

    if (!body || !body.id) {
      return NextResponse.json(
        { success: false, message: "Playlist ID Not Provided" },
        { status: 401, headers: { "content-type": "application/json" } }
      );
    }

    const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
    const token = await getToken();
    pb.authStore.save(token);
    await pb.collection("users").authRefresh();

    await pb.collection("playlists").delete(body.id);
    revalidatePath("/dashboard/playlists");

    return NextResponse.json(
      { success: true, message: "Playlist Deleted" },
      { status: 200, headers: { "content-type": "application/json" } }
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { success: false, message: "Playlist Not Deleted" },
      { status: 400, headers: { "content-type": "application/json" } }
    );
  }
}
