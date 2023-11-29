import { SpotifyApi } from "@spotify/web-api-ts-sdk";

export default async function getSpotify() {
  const res = await refreshTokenHandler(
    process.env.SPOTIFY_REFRESH_TOKEN!,
    process.env.SPOTIFY_CLIENT_ID!,
    process.env.SPOTIFY_CLIENT_SECRET!
  );
  if (res.access_token) {
    return SpotifyApi.withAccessToken(process.env.SPOTIFY_CLIENT_ID!, res);
  } else {
    getSpotify();
  }
}
async function refreshTokenHandler(
  refresh_token: string,
  client_id: string,
  client_secret: string
) {
  var authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        //@ts-expect-error
        new Buffer.from(client_id + ":" + client_secret).toString("base64"),
    },
    body: `grant_type=refresh_token&refresh_token=${refresh_token}`,
  };

  const res = await fetch(authOptions.url, {
    method: "POST",
    headers: authOptions.headers,
    body: authOptions.body,
    next: {
      revalidate: 1800,
    },
  });
  return res.json();
}
