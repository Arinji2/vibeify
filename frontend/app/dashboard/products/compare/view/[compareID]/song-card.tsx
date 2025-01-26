import { Track } from "@spotify/web-api-ts-sdk";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { SongImage } from "./song-card.client";

export function LoaderSongCard({ index }: { index: number }) {
  return (
    <div className="w-full h-[128px] shadow-button border-[3px] border-black bg-white rounded-md overflow-hidden p-3">
      <div className="w-full h-fit flex flex-row items-center justify-start shrink-0">
        <p className="text-[#69D2E7] font-bold text-[25px]">{index + 1}.</p>
      </div>

      <div className="w-full flex flex-col items-center justify-center gap-3">
        <Loader2 strokeWidth={3} className="animate-spin sizes-10 text-black" />
      </div>
    </div>
  );
}

export function SongCard({ index, item }: { item: Track; index: number }) {
  return (
    <Link
      href={item.external_urls.spotify}
      target="_blank"
      className="w-full h-[128px] shadow-button border-[3px] border-black bg-white rounded-md overflow-hidden p-2 md:p-3"
    >
      <div className="w-full h-fit flex flex-row items-center justify-start shrink-0">
        <p className="text-[#69D2E7] font-bold text-[25px]">{index + 1}.</p>
      </div>

      <div className="w-full flex flex-row items-center justify-start gap-3 mt-auto">
        <SongImage trackImage={item.album.images[0].url ?? ""} />
        <p className="text-black text-sm md:text-lg font-medium line-clamp-2">
          {item.name}
        </p>
      </div>
    </Link>
  );
}
