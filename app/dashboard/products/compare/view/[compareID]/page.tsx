import getSpotify from "@/utils/getSpotify";
import { getToken } from "@/utils/getToken";
import { CompareSchema } from "@/utils/validations/products/compare/schema";
import { notFound } from "next/navigation";
import Pocketbase from "pocketbase";
import { Suspense } from "react";
import "react-lazy-load-image-component/src/effects/blur.css";
import { LoaderSongSection, SongSection } from "./song-section";

export default async function Page({
  params,
}: {
  params: { compareID: string | undefined };
}) {
  if (!params.compareID) notFound();

  const pocketbase = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  const token = await getToken();
  pocketbase.authStore.save(token);

  await pocketbase.collection("users").authRefresh();
  const compareData = await pocketbase.collection("compareList").getFullList({
    filter: `id = "${params.compareID}" && user = "${
      pocketbase.authStore.model!.id
    }"`,
  });

  if (compareData.length === 0) notFound();
  const parsedCompareData = CompareSchema.safeParse(compareData[0]);
  if (!parsedCompareData.success) notFound();

  const spotify = await getSpotify();

  const playlist1 = await spotify.playlists.getPlaylist(
    parsedCompareData.data.playlist1
  );

  const playlist2 = await spotify.playlists.getPlaylist(
    parsedCompareData.data.playlist2
  );

  if (!parsedCompareData.data.results) notFound();

  return (
    <div className="w-full min-h-excludeNav rounded-sm bg-palette-background flex flex-col items-center justify-start py-4 gap-14 border-[3px] border-t-0  pb-6 border-black ">
      <div className="w-full h-fit flex flex-col items-center justify-center gap-4">
        <h1 className="text-black font-bold md:text-[40px] text-[20px] text-center line-clamp-2">
          COMPARE RESULTS
        </h1>
        <div className="w-fit max-w-[80%] xl:max-w-[55%] h-fit relative ">
          <p className="text-palette-accent font-bold md:text-[20px] text-[15px] text-center line-clamp-1">
            Comparing {playlist1.name} and {playlist2.name}
          </p>
        </div>
        <div className="w-full h-fit flex flex-col items-center justify-start gap-10">
          <Suspense
            fallback={
              <LoaderSongSection
                isCommon
                playlist={playlist1}
                compareData={parsedCompareData.data.results.common}
              />
            }
          >
            <SongSection
              isCommon
              playlist={playlist1}
              compareData={parsedCompareData.data.results.common}
            />
          </Suspense>
          <Suspense
            fallback={
              <LoaderSongSection
                playlist={playlist1}
                compareData={parsedCompareData.data.results.missingIn1}
              />
            }
          >
            <SongSection
              playlist={playlist1}
              compareData={parsedCompareData.data.results.missingIn1}
            />
          </Suspense>
          <Suspense
            fallback={
              <LoaderSongSection
                playlist={playlist2}
                compareData={parsedCompareData.data.results.missingIn2}
              />
            }
          >
            <SongSection
              playlist={playlist2}
              compareData={parsedCompareData.data.results.missingIn2}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
