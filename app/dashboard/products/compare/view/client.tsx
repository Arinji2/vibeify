"use client";

import Lottie from "react-lottie-player";
import Compare1 from "../../../../../public/animations/compare1.json";
import Compare2 from "../../../../../public/animations/compare2.json";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
export function Compare1Loading() {
  return (
    <Lottie
      animationData={Compare1}
      className="w-[150px] h-[150px]"
      loop
      play
    />
  );
}

export function Compare2Loading() {
  return (
    <Lottie
      animationData={Compare2}
      className="w-[150px] h-[150px]"
      loop
      play
    />
  );
}

export function CopyToClipboard() {
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Copied Link to clipboard!");
      }}
      className="text-xl font-bold text-palette-text border-b-2 border-black"
    >
      Copy Link To Clipboard
    </button>
  );
}
