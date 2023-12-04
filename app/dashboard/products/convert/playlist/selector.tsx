"use client";
import WidthWrapper from "@/app/(wrapper)/widthWrapper";
import { PlaylistType } from "@/utils/validations/playlists/types";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import sendRequestToApi from "./sendRequestToApi";
export default function PlaylistSelector({
  genres,
  playlists,
  token,
}: {
  token: string;
  genres: string[];
  playlists: PlaylistType[];
}) {
  const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistType | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  return (
    <>
      <div className="w-full h-fit  flex flex-row items-center justify-evenly flex-wrap gap-6 gap-x-4 mt-7">
        {playlists.map((playlist) => (
          <button
            key={playlist.id}
            onClick={() => setSelectedPlaylist(playlist)}
            className={`${
              selectedPlaylist?.id === playlist.id
                ? " bg-[#A6FAFF] "
                : " bg-palette-background "
            } shadow-button w-full  border-[5px] p-3 hover:shadow-buttonHover border-black flex flex-col items-start justify-center md:w-[400px] h-[100px]`}
          >
            <p className="text-palette-text w-full truncate text-left text-[20px] font-medium">
              {playlist.name}
            </p>
          </button>
        ))}
      </div>
      <div
        className={`transition-all ease-in-out flex duration-300 w-full h-[350px] md:h-[150px] items-center  flex-col justify-center bg-palette-background border-t-[5px] border-black border-x-[5px] right-0 fixed bottom-0`}
      >
        <WidthWrapper>
          <div className="w-full h-full md:flex-row items-center md:justify-between flex-col justify-center flex">
            <div className="w-full md:w-[50%]  h-full flex flex-col items-center justify-center gap-2">
              <p className="w-full text-3xl truncate text-black">
                Playlist:{" "}
                <span className="block w-full truncate md:inline font-bold">
                  {selectedPlaylist ? selectedPlaylist.name : "None"}
                </span>
              </p>
              <p className="w-full text-3xl truncate text-black">
                Genres:{" "}
                <span className="block w-full truncate md:inline font-bold">
                  {genres.join(", ")}
                </span>
              </p>
            </div>
            <div className="w-full md:w-[50%] h-full flex flex-col md:flex-row  items-start md:items-center md:justify-end justify-center gap-4  ">
              <Link
                href={"/dashboard/products/convert/playlist"}
                className="px-4 py-2  w-full md:w-fit shadow-button enabled:hover:shadow-buttonHover disabled:bg-slate-400 border-[3px] bg-palette-tertiary border-black  flex flex-row gap-2 items-center justify-center"
              >
                <p className="text-[25px] text-black font-medium">
                  Back to Genres
                </p>
              </Link>
              <button
                disabled={!selectedPlaylist}
                onClick={async () => {
                  console.log(token, selectedPlaylist, genres);
                  setLoading(true);
                  try {
                    await sendRequestToApi({
                      token,
                      selectedPlaylist: selectedPlaylist?.spotify_link!,
                      genres,
                    });

                    toast.success(
                      "Successfully added task! Please wait for a mail to be sent."
                    );
                    setTimeout(() => {
                      router.push("/dashboard/playlists");
                    }, 1000);
                  } catch (e: any) {
                    toast.error(e.message);
                  }
                  setLoading(false);
                }}
                className="px-4 py-2 h-[59px]  w-full md:w-[153px] shadow-button enabled:hover:shadow-buttonHover disabled:bg-slate-400 border-[3px] bg-palette-tertiary border-black  flex flex-row gap-2 items-center justify-center"
              >
                <p className="text-[25px] text-black font-medium">
                  {loading ? (
                    <Loader2 className="w-[30px] h-[30px] animate-spin" />
                  ) : (
                    "Continue"
                  )}
                </p>
              </button>
            </div>
          </div>
        </WidthWrapper>
      </div>
    </>
  );
}
