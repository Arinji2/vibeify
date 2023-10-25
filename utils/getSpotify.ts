import { SpotifyApi } from "@spotify/web-api-ts-sdk";

export default async function getSpotify() {
  const clientID = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  const api = SpotifyApi.withClientCredentials(clientID!, clientSecret!);
  return api;
}
