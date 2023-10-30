"use client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Pocketbase from "pocketbase";
import * as React from "react";
import { useState } from "react";
import { toast } from "react-toastify";

export default function DeletePlaylistModel({
  playlistID,

  setIsOpen,
  playlistName,
  redirect,
}: {
  playlistID: string;

  setIsOpen: Function;
  playlistName: string;
  redirect?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  return (
    <div
      className={
        "w-full h-[100svh] p-4 z-[10000] fixed top-0 left-0 bg-black bg-opacity-80 backdrop-blur-sm flex flex-col items-center justify-center"
      }
    >
      <div className="w-[90%] min-h-[400px] flex flex-col items-center justify-center p-4 md:h-[50%] gap-6  xl:w-[70%] aspect-video bg-palette-background border-[3px] border-black shadow-button">
        <h1 className="text-[60px] text-palette-text font-medium truncate w-full text-center ">
          Deleting{" "}
          <span className="md:text-[60px] text-[45px] xl:text-[80px] font-bold ">
            {playlistName}
          </span>
        </h1>
        <div className="w-full h-fit flex flex-row items-center justify-center flex-wrap gap-5">
          <button
            onClick={async () => {
              setLoading(true);
              const res = await fetch("/api/playlists/delete", {
                body: JSON.stringify({
                  id: playlistID,
                }),
                headers: {
                  "Content-Type": "application/json",
                },
                method: "POST",
              });

              if (res.status === 200) {
                toast.success("Playlist Deleted Successfully");
                if (redirect) router.push("/dashboard/playlists");
                router.refresh();
              } else {
                toast.error("Something went wrong");
              }
              setLoading(false);
              setIsOpen(false);
            }}
            className="w-[180px] h-[70px] bg-palette-error  border-[4px] border-black shadow-button hover:shadow-buttonHover transition-all ease-in-out duration-300 will-change-transform hover:scale-95 flex flex-col items-center justify-center "
          >
            <p className="text-white text-[30px] font-medium">
              {loading ? (
                <Loader2 className="animate-spin w-[40px] h-[40px]" />
              ) : (
                "Delete"
              )}
            </p>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsOpen(false);
            }}
            className="w-[180px] h-[70px] bg-palette-success  border-[4px] border-black shadow-button hover:shadow-buttonHover transition-all ease-in-out duration-300 will-change-transform hover:scale-95 flex flex-col items-center justify-center "
          >
            <p className="text-white text-[30px] font-medium">Go Back</p>
          </button>
        </div>
      </div>
    </div>
  );
}
