import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Pocketbase, { getTokenPayload } from "pocketbase";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => {
    return NextResponse.json(
      { success: false, message: "Token Not Provided" },
      { status: 400, headers: { "content-type": "application/json" } }
    );
  });

  if (!body || !body.token) {
    return NextResponse.json(
      { success: false, message: "Token Not Provided" },
      { status: 400, headers: { "content-type": "application/json" } }
    );
  }

  const tokenBody = body.token as string;
  const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

  await pb.admins.authWithPassword(
    process.env.ADMIN_EMAIL!,
    process.env.ADMIN_PASSWORD!
  );

  const payload = getTokenPayload(tokenBody);

  const data = await pb.collection(payload.collectionId).getOne(payload.id);

  const token = JSON.parse(cookies().get("pb_auth")?.value!).token;
  const cookie = JSON.stringify({ token, model: data });

  cookies().set("pb_auth", cookie, {
    secure: true,
    path: "/",
    sameSite: "strict",
    httpOnly: true,
  });

  return NextResponse.json(
    { success: true, message: "Cookies Updated" },
    { status: 200, headers: { "content-type": "application/json" } }
  );
}
