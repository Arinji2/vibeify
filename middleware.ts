import { NextRequest, NextResponse } from "next/server";
import { isTokenExpired } from "pocketbase";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    const authCookie = request.cookies.get("pb_auth");
    const token = authCookie?.value ? JSON.parse(authCookie.value).token : null;
    const verified = authCookie?.value
      ? (JSON.parse(authCookie.value).model.verified as boolean)
      : null;

    if (!token || isTokenExpired(token)) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    if (!verified || verified === null) {
      const url = request.nextUrl.clone();
      url.pathname = "/verify";
      return NextResponse.redirect(url);
    }
  }
}
