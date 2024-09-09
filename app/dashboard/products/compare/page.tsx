import getSpotify from "@/utils/getSpotify";
import { getToken } from "@/utils/getToken";
import { CompareListSchema } from "@/utils/validations/products/compare/schema";
import { CompareSchemaType } from "@/utils/validations/products/compare/types";
import eventsource from "eventsource";
import { Loader2 } from "lucide-react";
import Pocketbase from "pocketbase";
import React, { Suspense } from "react";
import { CompareCardClient } from "./compare-card.client";

if (typeof window === "undefined") {
  global.EventSource = eventsource;
}

const Colors = ["#69d2e7", "#7FBC8C", "#E3A018", "#FF69B4", "#9723C9"];
export default async function Page() {
  const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  const token = await getToken();

  pb.authStore.save(token);
  await pb.collection("users").authRefresh();

  const compareListRecord = await pb.collection("compareList").getFullList({
    filter: `user = "${pb.authStore.model!.id}"`,
  });

  const parsedCompareRecords = CompareListSchema.safeParse(compareListRecord);

  if (!parsedCompareRecords.success) throw new Error("Invalid Compare Data");
  return (
    <div className="w-full gap-14 min-h-excludeNav bg-palette-background border-[3px] border-t-0 py-3 pb-6 border-black rounded-sm flex flex-col items-center justify-center">
      <h1 className="font-bold text-5xl md:text-6xl pt-3 text-black  text-center">
        Saved Comparisons
      </h1>
      <div className="mt-auto w-full flex flex-wrap flex-row items-center justify-center gap-10 h-fit px-4">
        {parsedCompareRecords.data.map((compareData) => {
          const selectedColor =
            Colors[Math.floor(Math.random() * Colors.length)];
          return (
            <Suspense
              key={compareData.id}
              fallback={
                <CompareLoaderCard
                  compareData={compareData}
                  accentColor={selectedColor}
                />
              }
            >
              <CompareCard
                compareData={compareData}
                accentColor={selectedColor}
              />
            </Suspense>
          );
        })}
      </div>
    </div>
  );
}

async function CompareCard({
  compareData,
  accentColor,
}: {
  compareData: CompareSchemaType;
  accentColor: string;
}) {
  const spotify = await getSpotify();
  const playlist1 = await spotify.playlists.getPlaylist(compareData.playlist1);

  const playlist2 = await spotify.playlists.getPlaylist(compareData.playlist2);

  let pocketbaseToken = undefined;

  if (!compareData.results) {
    const pocketbase = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
    const token = await getToken();
    pocketbase.authStore.save(token);
    await pocketbase.collection("users").authRefresh();
    pocketbaseToken = token;
  }
  return (
    <div className="w-full md:w-[370px] h-[400px] border-[3px] shadow-button bg-white border-black rounded-lg flex flex-col items-center justify-start p-3 gap-6">
      <div
        style={
          {
            "--accentColor": accentColor,
          } as React.CSSProperties
        }
        className="w-full min-h-[50px] bg-[--accentColor] rounded-lg border-[3px] border-black"
      ></div>
      <div className="w-full h-[50px] py-2 flex flex-row items-center justify-center gap-3 border-b-[3px] border-black">
        <div className="w-[30%]  h-fit shrink-0">
          <p className="font-medium text-[16px] md:text-[20px] text-black text-right">
            Playlist 1:
          </p>
        </div>
        <div className="w-full h-fit truncate   ">
          <p className="font-medium text-[17px] text-black  truncate">
            {playlist1.name}
          </p>
        </div>
      </div>
      <div className="w-full h-[50px] py-2 flex flex-row items-center justify-center gap-3 border-b-[3px] border-black">
        <div className="w-[30%]  h-fit shrink-0">
          <p className="font-medium text-[16px] md:text-[20px] text-black text-right">
            Playlist 2:
          </p>
        </div>
        <div className="w-full h-fit truncate   ">
          <p className="font-medium text-[17px] text-black  truncate">
            {playlist2.name}
          </p>
        </div>
      </div>

      <CompareCardClient compareData={compareData} token={pocketbaseToken} />
    </div>
  );
}

function CompareLoaderCard({
  compareData,
  accentColor,
}: {
  compareData: CompareSchemaType;
  accentColor: string;
}) {
  return (
    <div className="w-[370px] h-[400px] border-[3px] shadow-button bg-white border-black rounded-lg flex flex-col items-center justify-start p-3 gap-6">
      <div
        style={
          {
            "--accentColor": accentColor,
          } as React.CSSProperties
        }
        className="w-full min-h-[50px] bg-[--accentColor] rounded-lg border-[3px] animate-pulse border-black"
      ></div>
      <div className="w-full h-[50px] py-2 flex flex-row items-center justify-center gap-3 border-b-[3px] border-black">
        <div className="w-[30%]  h-fit shrink-0">
          <p className="font-medium text-[20px] text-black text-right">
            Playlist 1:
          </p>
        </div>
        <div className="w-full h-fit truncate   ">
          <div className="w-full h-fit flex flex-col items-center justify-center">
            <Loader2
              strokeWidth={3}
              className="size-[20px] text-black animate-spin"
            />
          </div>
        </div>
      </div>
      <div className="w-full h-[50px] py-2 flex flex-row items-center justify-center gap-3 border-b-[3px] border-black">
        <div className="w-[30%]  h-fit shrink-0">
          <p className="font-medium text-[20px] text-black text-right">
            Playlist 2:
          </p>
        </div>
        <div className="w-full h-fit truncate   ">
          <div className="w-full h-fit flex flex-col items-center justify-center">
            <Loader2
              strokeWidth={3}
              className="size-[20px] text-black animate-spin"
            />
          </div>
        </div>
      </div>
      <div className="w-full h-[60px] bg-palette-background rounded-lg border-[2px] border-black flex flex-row items-center  justify-center gap-2">
        <div className="w-full h-full flex flex-row items-center justify-center gap-3">
          <p className="font-medium text-[18px] text-black">Public:</p>
          <div className="w-fit h-fit p-1 bg-[#FF7A5C] rounded-lg border-[2px] border-black">
            <Loader2
              strokeWidth={3}
              className="size-[13px] text-black animate-spin"
            />
          </div>
        </div>
        <div className="w-[2px] h-[90%] bg-black shrink-0"></div>
        <div className="w-full h-full flex flex-row items-center justify-center gap-3">
          <p className="font-medium text-[18px] text-black">Match:</p>
          <p className="font-medium text-[18px] text-palette-accent">-</p>
        </div>
      </div>
      {compareData.results ? (
        <div className="w-full h-fit flex flex-row items-center justify-between gap-2 mt-auto">
          <button
            disabled
            className="px-4 md:px-6 rounded-lg py-2  border-[3px] bg-palette-tertiary border-black  flex flex-row gap-2 items-center justify-center"
          >
            <p className="text-[15px] text-black font-medium">View</p>
          </button>
          <button
            disabled
            className="px-4 md:px-6 rounded-lg py-2  border-[3px] bg-palette-error border-black  flex flex-row gap-2 items-center justify-center"
          >
            <p className="text-[15px] text-white font-medium">Delete</p>
          </button>
          <button
            disabled
            className="px-4 md:px-6 rounded-lg py-2  border-[3px] bg-palette-tertiary border-black  flex flex-row gap-2 items-center justify-center"
          >
            <p className="text-[15px] text-black font-medium">Share</p>
          </button>
        </div>
      ) : (
        <div className="w-full h-[100px] bg-palette-tertiary rounded-lg border-[3px] border-black flex flex-row gap-3 items-center justify-center">
          <p className="font-medium text-[18px] text-black">
            Comparing Playlists
          </p>{" "}
          <Loader2
            strokeWidth={3}
            className="size-[20px] text-black animate-spin"
          />
        </div>
      )}
    </div>
  );
}
