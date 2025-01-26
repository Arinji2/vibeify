export const dynamic = "force-dynamic";
import { getToken } from "@/utils/getToken";
import { getPlaylist, getSync } from "@/utils/getUserData";
import { notFound } from "next/navigation";
import { Form } from "./form";

export default async function CreateForm({
  params,
}: {
  params: { playlistID: string | undefined };
}) {
  if (!params.playlistID) notFound();
  const token = await getToken();

  const playlistData = await getPlaylist(token, params.playlistID);

  const syncData = await getSync(token, params.playlistID);

  return (
    <main className="md:min-h-excludeNav min-h-excludeMobNav bg-palette-accent w-full flex flex-col items-center justify-center py-3 ">
      <Form syncData={syncData} playlistData={playlistData} />
    </main>
  );
}
