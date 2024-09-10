"use client";
import { AddToCompare } from "@/actions/compare/addToCompare";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { toast } from "react-toastify";

export function PlaylistImage({
  image,
  recordID,
}: {
  image: string;
  recordID: string;
}) {
  return (
    <div className="size-20 shrink-0 md:size-24 rounded-md border-[3px] border-black ">
      <LazyLoadImage
        src={`https://db-listify.arinji.com/api/files/qblcdcbffwb2y8c/${recordID}/${image}`}
        alt="playlist"
        className="w-full h-full object-cover"
        effect="blur"
      />
    </div>
  );
}

export function ComparePlaylistButton({
  playlist1,
  playlist2,
}: {
  playlist1: string;
  playlist2: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  return (
    <button
      disabled={loading}
      onClick={async () => {
        if (loading) return;
        setLoading(true);
        const res = await AddToCompare({
          playlist1: playlist1,
          playlist2: playlist2,
        });
        setLoading(false);
        if (res.success) {
          toast.success("Added to Compare List!");
          router.push(`/dashboard/products/compare`);
        } else {
          toast.error(res.message);
          router.push("/dashboard/products/compare/setup");
        }
      }}
      className="md:w-[95px] w-[73px] h-[37px] md:h-[41px]  rounded-lg  text-xs md:text-sm shadow-buttonHover border-[3px] bg-blue-500 border-black  flex flex-row gap-2 items-center justify-center"
    >
      {loading ? (
        <Loader2 strokeWidth={3} className="animate-spin size-[15px]" />
      ) : (
        "Select"
      )}
    </button>
  );
}
