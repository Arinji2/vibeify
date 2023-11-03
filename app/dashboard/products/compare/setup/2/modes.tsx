"use client";
import ValidatePlaylistAction from "@/actions/compare/validatePlaylist";
import { PlaylistType } from "@/utils/validations/playlists/types";
import { BadgePlus, Loader2, MousePointerSquareDashed } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export function ModeSelector() {
  return (
    <div className="w-full h-fit flex flex-col md:flex-row  items-center justify-center gap-4">
      <Link
        href="/dashboard/products/compare/setup/2?mode=old"
        className="bg-palette-background w-[300px] h-[300px] md:h-[400px] flex flex-col gap-3 items-center justify-center border-[4px] border-black shadow-button hover:shadow-buttonHover transition-all ease-in-out duration-300"
      >
        <div className="border-[3px] border-black p-4 rounded-md">
          <MousePointerSquareDashed className="w-[100px] h-[100px] text-palette-accent" />
        </div>
        <h2 className=" font-medium text-palette-text text-[25px] text-center">
          Select from saved playlists!
        </h2>
      </Link>
      <Link
        href="/dashboard/products/compare/setup/2?mode=new"
        className="bg-palette-background w-[300px] h-[300px] md:h-[400px] flex flex-col gap-3 items-center justify-center border-[4px] border-black shadow-button hover:shadow-buttonHover transition-all ease-in-out duration-300"
      >
        <div className="border-[3px] border-black p-4 rounded-md">
          <BadgePlus className="w-[100px] h-[100px] text-palette-accent" />
        </div>
        <h2 className=" font-medium text-palette-text text-[25px] text-center">
          Use a new playlist using Spotify Link!
        </h2>
      </Link>
    </div>
  );
}

export function NewPlaylist() {
  const router = useRouter();
  const [link, setLink] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <div className="border-[4px] border-black rounded-md p-4 w-full max-w-[500px] shadow-button flex flex-col items-start justify-center gap-4 h-fit">
      <input
        type="text"
        name="displayLink"
        value={link}
        placeholder="https://open.spotify.com/playlist/..."
        onChange={(e) => setLink(e.target.value)}
        className="w-full text-xl p-4 px-2 z-30 border-[4px] border-black bg-palette-background text-palette-text focus:outline-none"
      />
      <button
        onClick={async () => {
          if (
            link.length < 5 ||
            !link.startsWith("https://open.spotify.com/playlist/")
          ) {
            toast.error("Invalid Spotify Link!");
            return;
          }
          setLoading(true);

          const res = await ValidatePlaylistAction(link);
          if (res.status !== 200) {
            toast.error(res.message);
            setLoading(false);
            return;
          } else {
            toast.success("Playlist Validated!");
            const playlistID1 = localStorage.getItem("playlist1ID");
            if (!playlistID1)
              router.push(`/dashboard/products/compare/setup/1`);
            router.push(
              `/dashboard/products/compare/view?ids=${playlistID1},${
                link.split("/")[4]
              }`
            );
          }
        }}
        className="px-4 py-2 shadow-button hover:shadow-buttonHover border-[3px] bg-palette-tertiary border-black  flex flex-row gap-2 items-center justify-center"
      >
        {loading && (
          <Loader2 className="h-[15px] w-[15px] animate-spin text-black" />
        )}{" "}
        <p className="text-[15px] text-black font-medium">Save</p>
      </button>
    </div>
  );
}

export function OldPlaylistClient({
  playlists,
}: {
  playlists: PlaylistType[];
}) {
  const router = useRouter();

  return (
    <div className="w-full max-h-[550px] py-3  md:max-h-[400px] no-scrollbar overflow-y-auto flex flex-row items-center justify-center gap-5 flex-wrap">
      {playlists.map((playlist) => (
        <button
          key={playlist.id}
          onClick={() => {
            const playlistID1 = localStorage.getItem("playlist1ID");
            if (!playlistID1)
              router.push(`/dashboard/products/compare/setup/1`);
            router.push(
              `/dashboard/products/compare/view?ids=${playlistID1},${
                playlist.spotify_link.split("/")[4]
              }`
            );
          }}
          className="h-[100px] hover:shadow-buttonHover transition-all ease-in-out duration-300 shrink-0 p-3 border-[4px] border-black shadow-button w-full md:w-[200px] flex flex-col items-start justify-center bg-palette-background"
        >
          <h3 className="text-palette-text font-bold text-2xl w-full text-left truncate">
            {playlist.name}
          </h3>
        </button>
      ))}
    </div>
  );
}
