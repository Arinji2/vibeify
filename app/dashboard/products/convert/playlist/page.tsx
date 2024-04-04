import { getModel } from "@/utils/getModel";
import { getToken } from "@/utils/getToken";
import { PlaylistsSchema } from "@/utils/validations/playlists/schema";
import { notFound, redirect } from "next/navigation";
import Pocketbase from "pocketbase";
import { genresArray } from "../../genresFile";
import PlaylistSelector from "./selector";
export default async function Page({
  searchParams,
}: {
  searchParams: { [genres: string]: string | undefined | string[] };
}) {
  const rawGenres = searchParams["genres"];
  if (!rawGenres) redirect("/dashboard/products/convert");
  if (Array.isArray(rawGenres)) redirect("/dashboard/products/convert");
  const parsedGenres = rawGenres.toLowerCase().split(",");

  const finalGenres: string[] = [];

  if (!finalGenres) redirect("/dashboard/products/convert");
  if (!Array.isArray(finalGenres)) redirect("/dashboard/products/convert");
  try {
    parsedGenres.forEach((genre) => {
      if (genresArray.includes(genre)) finalGenres.push(genre);
    });
  } catch (e) {
    redirect("/dashboard/products/convert");
  }

  const userData = await getModel();
  const token = await getToken();

  let playlistData;

  const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  try {
    let playlistRecord = await pb.collection("playlists").getFullList({
      filter: `created_by = "${userData.id}"`,
    });

    let parsedPlaylist = PlaylistsSchema.safeParse(playlistRecord);
    if (!parsedPlaylist.success) notFound();

    playlistData = parsedPlaylist.data;
  } catch (e) {
    notFound();
  }

  const formattedGenres = finalGenres.map((genre) => {
    const newGenre = genre.slice(0, 1).toUpperCase() + genre.slice(1);

    return newGenre;
  });

  if (finalGenres.length === 0) redirect("/dashboard/products/convert");
  return (
    <div className="w-full h-excludeMobNav md:h-excludeNav py-5 md:p-5 flex flex-col items-center justify-start">
      <h1 className="font-bold text-[30px] md:text-[50px]">
        SELECT A PLAYLIST
      </h1>
      <div className="w-full md:h-[calc(100%-200px)] h-[calc(100%-400px)] flex flex-col items-center justify-start overflow-y-auto">
        <PlaylistSelector
          token={token}
          playlists={playlistData}
          genres={formattedGenres}
        />
      </div>
    </div>
  );
}
