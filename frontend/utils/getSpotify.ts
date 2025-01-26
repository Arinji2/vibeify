/*
There is a chance this breaks due to how we authenticate the Vibeify Account. If it breaks follow the following

1. Go to https://accounts.spotify.com/authorize?client_id=CLIENT_ID_HERE&response_type=code&redirect_uri=https%3A%2F%2Fvibeify.arinji.com&scope=user-read-email%20playlist-modify-public%20playlist-modify-private%20playlist-read-private%20playlist-read-collaborative%20user-read-private
2. Extract the auth code from this, and then use it in the following curl request
3. curl -X POST \
  -H "Authorization: Basic {CREDS_CODE}" \
  -d grant_type=authorization_code \
  -d code={AUTH_CODE} \
  -d redirect_uri=https://vibeify.arinji.com \
  https://accounts.spotify.com/api/token

  CREDS_CODE can be gotten from this code echo -n 'CLIENT_ID_HERE:CLIENT_SECRET_HERE' | base64
  AUTH_CODE can be gotten from the auth code in the url

*/

import { SpotifyApi } from "@spotify/web-api-ts-sdk";

export default async function getSpotify() {
  const res = await refreshTokenHandler(
    process.env.SPOTIFY_REFRESH_TOKEN!,
    process.env.SPOTIFY_CLIENT_ID!,
    process.env.SPOTIFY_CLIENT_SECRET!
  );

  if (res.access_token) {
    const spotify = SpotifyApi.withAccessToken(
      process.env.SPOTIFY_CLIENT_ID!,
      res
    )!;
    const token = await spotify.getAccessToken();

    const expires = token?.expires!;
    const currentTime = Date.now();

    if (currentTime > expires) {
      return getSpotify();
    } else {
      return spotify;
    }
  } else {
    return getSpotify();
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
    cache: "no-cache",
  });

  if (res.status === 400)
    throw new Error("Invalid Credentials. Fix Detailed in Comments");

  return res.json();
}
