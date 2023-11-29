"use client";
import UpdateThemeAction from "@/actions/playlist/updateTheme";
import { ThemesType } from "@/utils/validations/playlists/themes";
import { PlaylistType } from "@/utils/validations/playlists/types";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Themes({
  playlistData,
}: {
  playlistData: PlaylistType;
}) {
  const [theme, setTheme] = useState<ThemesType>(playlistData.theme);
  const [loading, setLoading] = useState(false);

  return (
    <div className="md:w-[50%] h-full w-full flex flex-col items-center justify-center gap-4">
      <div className="h-fit md:w-[50%] w-[90%] flex flex-col items-center  gap-2">
        <h1 className="text-palette-background text-[30px] line-clamp-2  font-semibold md:text-[40px]">
          Themes
        </h1>
        <div className="bg-palette-text h-[3px] w-full"></div>
      </div>
      <div className="w-[95%] h-[345px] border-[3px] border-black shadow-button flex flex-col items-center justify-center bg-palette-background relative">
        <button
          onClick={(e) => {
            e.preventDefault();
            if (theme === "default") setTheme("pixel");
            else if (theme === "pixel") setTheme("neo-brutalism");
            else setTheme("default");
          }}
          className="absolute left-0 w-[50px] h-[48px]  border-black border-[3px] rounded-tr-2xl rounded-br-2xl border-l-0 flex flex-col items-center justify-center"
        >
          <ChevronLeft className="w-[40px] h-[40px]  text-black" />
        </button>
        <div className="w-full h-[55%] flex flex-col items-center justify-end">
          <p className="text-black text-4xl font-bold">{theme.toUpperCase()}</p>
        </div>
        <div className="w-full h-[45%] flex flex-row items-center justify-center flex-wrap gap-3 ">
          <Link
            href={`/${playlistData.link}?testMode=${theme}`}
            className=" w-[120px] md:w-[150px] h-[50px] hover:shadow-buttonHover flex flex-col items-center justify-center transition-all ease-in-out duration-300 bg-palette-tertiary text-palette-background font-semibold border-black border-[3px] shadow-button "
          >
            <p className="text-black text-base md:text-xl">View</p>
          </Link>
          <button
            disabled={playlistData.theme === theme}
            onClick={async (e) => {
              e.preventDefault();
              setLoading(true);
              const res = await UpdateThemeAction(
                playlistData.id!,
                playlistData.link,
                theme
              );
              if (res.status === 200) {
                toast.success("Theme Updated Successfully");
              } else {
                toast.error("Theme Update Failed");
              }
              setLoading(false);
            }}
            className=" w-[120px] md:w-[150px] h-[50px] flex flex-col items-center justify-center enabled:hover:shadow-buttonHover transition-all bg-opacity-70 ease-in-out duration-300 bg-palette-success text-palette-background font-semibold border-black border-[3px] shadow-button "
          >
            <p className="text-black text-base md:text-xl">
              {loading ? (
                <Loader2 className="text-black w-[30px] h-[30px] animate-spin" />
              ) : playlistData.theme === theme ? (
                "Saved"
              ) : (
                "Save"
              )}
            </p>
          </button>
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            if (theme === "default") setTheme("neo-brutalism");
            else if (theme === "neo-brutalism") setTheme("pixel");
            else setTheme("default");
          }}
          className="absolute right-0 w-[50px] h-[48px]  border-black border-[3px] rounded-tl-2xl rounded-bl-2xl border-r-0 flex flex-col items-center justify-center"
        >
          <ChevronRight className="w-[40px] h-[40px]  text-black" />
        </button>
      </div>
    </div>
  );
}
