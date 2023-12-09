"use client";
import DeletePlaylistModel from "@/app/(models)/deletePlaylistModel";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import Pocketbase from "pocketbase";

export default function SyncButton({ id }: { id: string }) {
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
      className="w-[100px] h-[35px] bg-palette-tertiary  border-[3px] border-black shadow-button hover:shadow-buttonHover transition-all ease-in-out duration-300 will-change-transform hover:scale-95 flex flex-col items-center justify-center "
    >
      <p className="text-black text-[20px] font-medium">
        {loading ? <Loader2 className="animate-spin" /> : "Sync"}
      </p>
    </button>
  );
}

export function DeleteButton({
  id,

  name,
}: {
  id: string;

  name: string;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault();
          setIsDeleting(true);
        }}
        className="w-[100px] h-[35px] bg-palette-tertiary border-[3px] border-black shadow-button hover:shadow-buttonHover transition-all ease-in-out duration-300 will-change-transform hover:scale-95 flex flex-col items-center justify-center "
      >
        <p className="text-black text-[20px] font-medium">Delete</p>
      </button>

      {isDeleting &&
        createPortal(
          <DeletePlaylistModel
            playlistID={id}
            setIsOpen={setIsDeleting}
            playlistName={name}
          />,
          document.body
        )}
    </>
  );
}

export function LocalstorageChecker() {
  const router = useRouter();

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("checking localstorage");
      if (window.localStorage) {
        const url = window.localStorage.getItem("signUpPlaylist");

        if (url) {
          router.push(`/dashboard/playlists/create?signUp=${url}`);
          router.refresh();
        }
      }
    }
  }, []);

  return <></>;
}
