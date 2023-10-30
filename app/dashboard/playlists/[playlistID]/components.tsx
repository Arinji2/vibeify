"use client";
import DeletePlaylistModel from "@/app/(models)/deletePlaylistModel";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useState } from "react";
import { createPortal } from "react-dom";

import { toast } from "react-toastify";

export function WeeklySync() {
  const [sync, setSync] = useState(false);

  return (
    <div
      onClick={() => setSync(!sync)}
      className="w-[60px] h-[25px] border-[3px] hover:cursor-pointer border-black rounded-3xl flex overflow-hidden group flex-col items-center justify-start relative"
    >
      <div
        className={`${
          sync
            ? "bg-palette-success translate-x-[50%] "
            : "bg-palette-error -translate-x-[50%] "
        }bg-palette-error w-[40px] h-[20px] rounded-3xl transition-all ease-in-out duration-300   absolute`}
      ></div>
    </div>
  );
}

export function Visibility() {
  const [visibilityState, setVisibilityState] = useState(false);

  return (
    <div
      onClick={() => setVisibilityState(!visibilityState)}
      className="w-[60px] h-[25px] border-[3px] hover:cursor-pointer border-black rounded-3xl flex overflow-hidden group flex-col items-center justify-start relative"
    >
      <div
        className={`${
          visibilityState
            ? "bg-palette-success translate-x-[50%] "
            : "bg-palette-error -translate-x-[50%] "
        }bg-palette-error w-[40px] h-[20px] rounded-3xl transition-all ease-in-out duration-300   absolute`}
      ></div>
    </div>
  );
}

export function SyncButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  return (
    <button
      onClick={async (e) => {
        e.preventDefault();
        setLoading(true);

        const res = await fetch("/api/playlists/sync", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: id,
            cron: false,
          }),
        });
        if (res.status === 200) {
          toast.success("Playlist Synced Successfully");
          setLoading(false);
          router.refresh();
        } else {
          setLoading(false);
          if (res.status === 401) toast.error("Invalid Data Provided");
          else if (res.status === 402) toast.error("Playlist Not Found");
          else if (res.status === 403) toast.error("Sync Not Found");
          else if (res.status === 404) toast.error("Weekly Sync Disabled");
          else if (res.status === 405) {
            const body = await res.json();

            const minutes = body.body.remaining;

            toast.error(`Please wait ${minutes} minutes before syncing again`);
          } else {
          }
        }
      }}
      className="w-full xl:w-[150px] h-[50px] hover:shadow-buttonHover transition-all ease-in-out duration-300 bg-palette-tertiary text-palette-background flex flex-col items-center justify-center font-semibold border-black border-[3px] shadow-button "
    >
      {loading ? (
        <Loader2 className="w-[25px] h-[25px] text-black animate-spin" />
      ) : (
        <p className="text-black text-xl">Sync</p>
      )}
    </button>
  );
}

export function DeleteButton({ id, name }: { id: string; name: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault();
          setIsDeleting(true);
        }}
        className="w-full xl:w-[150px] h-[50px] hover:shadow-buttonHover flex flex-col items-center justify-center transition-all ease-in-out duration-300 bg-opacity-75 bg-palette-error text-palette-background font-semibold border-black border-[3px] shadow-button "
      >
        <p className="text-black text-xl">Delete</p>
      </button>

      {isDeleting &&
        createPortal(
          <DeletePlaylistModel
            playlistID={id}
            setIsOpen={setIsDeleting}
            playlistName={name}
            redirect
          />,
          document.body
        )}
    </>
  );
}
