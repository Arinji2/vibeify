"use client";

import { REGEX } from "@/utils/regex";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export function Form({ center }: { center?: boolean }) {
  const router = useRouter();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        const input = e.currentTarget[0] as HTMLInputElement;
        const url = input.value;
        const isValid = REGEX.SPOTIFY_URL.test(url) ? true : false;

        if (isValid) {
          localStorage.setItem("signUpPlaylist", url);
        }
        router.prefetch("/register");
        router.push("/register");
      }}
      className={`${
        center ? "justify-center " : "justify-start "
      }flex h-fit w-full flex-col items-center  gap-5 md:flex-row`}
    >
      <input
        type="url"
        placeholder="Spotify Playlist Link"
        className="h-[58px] border-[3px] border-palette-text px-[17px] py-5 text-[20px] font-medium text-palette-text text-opacity-60 md:h-[85px] xl:h-[100px] xl:w-[600px]"
      />
      <button
        type="submit"
        className="h-fit w-fit border-[3px] border-palette-text bg-palette-tertiary p-2 text-[20px] font-medium text-palette-text shadow-button transition-all duration-300 ease-out will-change-transform hover:scale-95 hover:shadow-buttonHover md:p-5 md:text-[30px] xl:text-[40px]"
      >
        Start Playing
      </button>
    </form>
  );
}
