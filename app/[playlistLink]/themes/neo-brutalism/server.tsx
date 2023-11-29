import WidthWrapper from "@/app/(wrapper)/widthWrapper";
import { UserType } from "@/utils/validations/account/types";
import { TrackType } from "@/utils/validations/playlists/themes";
import { PlaylistType, ViewType } from "@/utils/validations/playlists/types";
import { Playlist } from "@spotify/web-api-ts-sdk";
import { ChevronDownCircle } from "lucide-react";
import Image from "next/image";
import TracksComponent from "../../tracksComp";
import { IBM_Plex_Mono } from "next/font/google";

const iBM_Plex_Mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

export function NeoBrutalismPage({
  parsedPlaylistData,
  parsedUserData,
  parsedViewData,
  spotifyPlaylist,
  tracks,
}: {
  parsedPlaylistData: PlaylistType;
  parsedUserData: UserType;
  parsedViewData: ViewType[];
  spotifyPlaylist: Playlist;
  tracks: TrackType[];
}) {
  return (
    <section
      className={`${iBM_Plex_Mono.className} w-full h-fit relative bg-repeat bg-[#FCFD96] bg-opacity-60 text-center `}
    >
      <WidthWrapper>
        <section className="w-full p-2 gap-4 md:gap-10 mt-10 md:mt-0 h-fit relative md:h-[100svh] flex flex-col items-center justify-center pb-10">
          <div className="w-full h-fit py-10 rounded-md bg-white shadow-[10px_10px_0_#000] border-[5px] border-black">
            <h1
              className={`text-[40px] md:text-[80px] xl:text-[100px] text-black font-bold w-full line-clamp-2 break-words `}
            >
              {parsedPlaylistData.display_name}
            </h1>
            <h2 className=" text-xl md:text-3xl text-black font-medium">
              By -{" "}
              <span className="font-medium">{parsedUserData.username}</span>
            </h2>
          </div>

          <article className=" w-[80%] h-fit flex flex-col md:flex-row flex-wrap gap-6 mt-5 md:mt-0 items-center justify-evenly">
            <div className="w-[150px] h-[70px] bg-[#A6FAFF] border-[4px] border-black shadow-button rounded-md flex flex-row items-center justify-center gap-3">
              <Image
                src="/themes/neo-brutalism/views.png"
                width={50}
                height={50}
                className="object-contain"
                alt="Views"
              />
              <p className="text-palette-text text-lg md:text-[35px] font-bold">
                {parsedViewData.length}
              </p>
            </div>
            <div className="w-[150px] h-[70px] bg-[#A6FAFF] border-[4px] border-black shadow-button rounded-md flex flex-row items-center justify-center gap-3">
              <Image
                src="/themes/neo-brutalism/likes.png"
                width={50}
                height={50}
                className="object-contain"
                alt="Views"
              />
              <p className="text-palette-text text-lg md:text-[35px] font-bold">
                {spotifyPlaylist.followers.total}
              </p>
            </div>
            <div className="w-[150px] h-[70px] bg-[#A6FAFF] border-[4px] border-black shadow-button rounded-md flex flex-row items-center justify-center gap-3">
              <Image
                src="/themes/neo-brutalism/tracks.png"
                width={50}
                height={50}
                className="object-contain"
                alt="Views"
              />
              <p className="text-palette-text text-lg md:text-[35px] font-bold">
                {spotifyPlaylist.tracks.total}
              </p>
            </div>
          </article>
          <div className="w-full h-fit p-3 mt-5 md:mt-0  md:absolute bottom-5 flex flex-col items-center justify-center shrink-0">
            <ChevronDownCircle className="text-3xl w-[30px] h-[30px] text-black animate-bounce" />
          </div>
        </section>
        <div className="w-full h-fit p-4 bg-[#BAFDA2] flex flex-col items-center justify-center border-[4px] border-black shadow-button rounded-md">
          <p className="text-[25px] md:text-[40px] font-bold text-black">
            Nothing to see here, just vibes!!
          </p>
        </div>
        <TracksComponent
          playlistData={spotifyPlaylist}
          initialTracks={tracks}
          theme={parsedPlaylistData.theme}
        />
      </WidthWrapper>
    </section>
  );
}
