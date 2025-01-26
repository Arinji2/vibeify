import WidthWrapper from "@/app/(wrapper)/widthWrapper";
import {
  LoaderSongSection,
  SongSection,
} from "@/app/dashboard/products/compare/view/[compareID]/song-section";
import Footer from "@/app/footer";
import getSpotify from "@/utils/getSpotify";
import { CompareSchema } from "@/utils/validations/products/compare/schema";
import { notFound } from "next/navigation";
import Pocketbase from "pocketbase";
import { Suspense } from "react";
import "react-lazy-load-image-component/src/effects/blur.css";

export default async function Page({
  params,
}: {
  params: { link: string | undefined };
}) {
  const pocketbase = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  try {
    const data = await pocketbase
      .collection("compareList")
      .getFirstListItem(`shareLink = "${params.link}"`);
  } catch (e) {
    notFound();
  }

  const data = await pocketbase
    .collection("compareList")
    .getFirstListItem(`shareLink = "${params.link}"`);

  const parsedCompareData = CompareSchema.safeParse(data);
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
    <>
      <div className="w-full min-h-excludeNav rounded-sm bg-palette-background flex flex-col items-center justify-start py-4 gap-14 border-[3px] border-t-0  pb-6 border-black ">
        <WidthWrapper>
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
        </WidthWrapper>
      </div>
      <Footer full />
    </>
  );
}
