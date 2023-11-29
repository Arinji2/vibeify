import WidthWrapper from "@/app/(wrapper)/widthWrapper";
import { UserType } from "@/utils/validations/account/types";
import { TrackType } from "@/utils/validations/playlists/themes";
import { PlaylistType, ViewType } from "@/utils/validations/playlists/types";
import { Playlist } from "@spotify/web-api-ts-sdk";
import { ChevronDownCircle } from "lucide-react";
import { Cabin_Condensed, Press_Start_2P } from "next/font/google";
import Image from "next/image";
import TracksComponent from "../../tracksComp";

const press_Start_2P = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
});

const cabin_Condensed = Cabin_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export function PixelPage({
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
      className={`${cabin_Condensed.className} w-full h-fit flex flex-col py-10 rounded-md items-center justify-start  bg-[#F9C62C]  text-center `}
    >
      <div
        className={`${cabin_Condensed.className} w-[90%] border-[3px] border-black h-[90%] flex flex-col py-10 items-center justify-start   rounded-md bg-white text-center `}
      >
        <WidthWrapper>
          <section className="w-full p-2  mt-10 md:mt-0 h-fit relative flex flex-col items-center justify-start pb-10 gap-4">
            <div className="w-full h-fit gap-8 flex flex-col items-center justify-center py-10 rounded-md bg-[#80EED3] border-[5px] border-black">
              <h1
                className={`${press_Start_2P.className} text-[40px] md:text-[50px] xl:text-[80px] text-black  w-full line-clamp-2 break-words `}
              >
                {parsedPlaylistData.display_name}
              </h1>
              <h2 className=" text-xl md:text-3xl text-black font-medium">
                By -{" "}
                <span className="font-medium">{parsedUserData.username}</span>
              </h2>

              <article className=" w-[80%] h-fit  flex flex-col mt-6 md:flex-row flex-wrap gap-6  items-center justify-evenly">
                <div
                  className={`${press_Start_2P.className} w-[200px] h-[70px] bg-white border-[4px] border-black shadow-button rounded-md flex flex-row items-center justify-center gap-3`}
                >
                  <Image
                    src="/themes/neo-brutalism/views.png"
                    width={50}
                    height={50}
                    className="object-contain"
                    alt="Views"
                  />
                  <p className="text-palette-text text-[15px] md:text-[25px]">
                    {parsedViewData.length}
                  </p>
                </div>
                <div
                  className={`${press_Start_2P.className} w-[200px] h-[70px] bg-white border-[4px] border-black shadow-button rounded-md flex flex-row items-center justify-center gap-3`}
                >
                  <Image
                    src="/themes/neo-brutalism/likes.png"
                    width={50}
                    height={50}
                    className="object-contain"
                    alt="Views"
                  />
                  <p className="text-palette-text text-[15px] md:text-[25px]">
                    {spotifyPlaylist.followers.total}
                  </p>
                </div>
                <div
                  className={`${press_Start_2P.className} w-[200px] h-[70px] bg-white border-[4px] border-black shadow-button rounded-md flex flex-row items-center justify-center gap-3`}
                >
                  <Image
                    src="/themes/neo-brutalism/tracks.png"
                    width={50}
                    height={50}
                    className="object-contain"
                    alt="Views"
                  />
                  <p className="text-palette-text text-[15px] md:text-[25px]">
                    {spotifyPlaylist.tracks.total}
                  </p>
                </div>
              </article>
            </div>

            <div className="w-full  h-fit p-3 mt-5 md:mt-20 flex flex-col items-center justify-center shrink-0">
              <ChevronDownCircle className="text-3xl w-[30px] h-[30px] text-black animate-bounce" />
            </div>
          </section>

          <TracksComponent
            playlistData={spotifyPlaylist}
            initialTracks={tracks}
            theme={parsedPlaylistData.theme}
          />
        </WidthWrapper>
      </div>
    </section>
  );
}
