"use client";
import WidthWrapper from "@/app/(wrapper)/widthWrapper";
import { PlaylistType } from "@/utils/validations/playlists/types";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { PlaylistImage } from "../../compare/setup/playlist-card.client";
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
      <div className="w-full h-fit  grid md:grid-cols-2 grid-cols-1 gap-4 mt-7">
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            className="w-full max-w-[600px] gap-4 px-4 py-4 border-[3px] bg-palette-background rounded-lg flex flex-row items-center justify-between border-black shadow-button h-[150px]"
          >
            <PlaylistImage image={playlist.image} recordID={playlist.id!} />
            <div className="w-fit h-fit flex flex-col items-end justify-center gap-5">
              <h2 className="text-xl md:text-3xl font-medium text-palette-text line-clamp-1">
                {playlist.name}
              </h2>
              <div className="w-fit h-fit flex flex-row items-center justify-end gap-4">
                <button
                  onClick={() => setSelectedPlaylist(playlist)}
                  className={`${
                    selectedPlaylist?.id === playlist.id
                      ? " bg-blue-500 "
                      : " bg-gray-600 "
                  } px-4 md:px-6 w-[73px] md:w-[95px] rounded-lg py-2 text-xs md:text-sm shadow-buttonHover border-[3px]  border-black  flex flex-row gap-2 items-center justify-center`}
                >
                  Select
                </button>

                <Link
                  href={playlist.spotify_link}
                  target="_blank"
                  className="px-4 md:px-6 whitespace-nowrap rounded-lg py-2 text-xs md:text-sm shadow-buttonHover border-[3px] bg-palette-accent border-black  flex flex-row gap-2 items-center justify-center"
                >
                  View In Spotify
                </Link>
              </div>
            </div>
          </div>
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
