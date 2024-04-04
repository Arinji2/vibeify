import { getToken } from "@/utils/getToken";
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

    if (!body || !body.id1 || !body.id2 || !body.link) {
      return NextResponse.json(
        { success: false, message: "Playlist IDS OR Link Not Provided" },
        { status: 401, headers: { "content-type": "application/json" } }
      );
    }

    const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
    const token = await getToken();
    pb.authStore.save(token);
    await pb.collection("users").authRefresh();
    try {
      await pb.collection("compare").getFirstListItem(`link = "${body.link}"`);

      return NextResponse.json(
        { success: false, message: "Link Taken" },
        { status: 409, headers: { "content-type": "application/json" } }
      );
    } catch (e) {}
    await pb.collection("compare").create({
      link: body.link,
      spotifyLink1: body.id1,
      spotifyLink2: body.id2,
    });

    return NextResponse.json(
      { success: true, message: "Compare Shared" },
      { status: 200, headers: { "content-type": "application/json" } }
    );
  } catch (e) {
    return NextResponse.json(
      { success: false, message: "Compare Not Shared" },
      { status: 400, headers: { "content-type": "application/json" } }
    );
  }
}
