"use server";

export default async function sendRequestToApi({
  token,
  selectedPlaylist,
  genres,
}: {
  token: string;
  selectedPlaylist: string;
  genres: string[];
}) {
  const lowercaseGenres = genres.map((genre) => genre.toLowerCase());
  const body = {
    userToken: token,
    spotifyURL: selectedPlaylist,
    genres: lowercaseGenres,
  };

  const res = await fetch("https://api.arinji.com/vibeify/addTask", {
    body: JSON.stringify(body),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-cache",
  });

  const data = await res.json();
  if (res.status !== 200) throw new Error(data.message);
  return data;
}
