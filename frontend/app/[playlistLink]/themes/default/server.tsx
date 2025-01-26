import WidthWrapper from "@/app/(wrapper)/widthWrapper";
import { UserType } from "@/utils/validations/account/types";
import { TrackType } from "@/utils/validations/playlists/themes";
import { PlaylistType, ViewType } from "@/utils/validations/playlists/types";
import { Playlist } from "@spotify/web-api-ts-sdk";
import { ChevronDownCircle } from "lucide-react";
import Image from "next/image";
import TracksComponent from "../../tracksComp";

export function DefaultPage({
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
    <section className="w-full h-fit relative bg-[url('../public/default-bg.png')] bg-repeat bg-palette-background text-center ">
      <WidthWrapper>
        <section className="w-full p-2  mt-10 md:mt-0 h-fit relative md:h-[100svh] flex flex-col items-center justify-center pb-10 gap-4">
          <h1
            className={`text-[40px] md:text-[80px] xl:text-[100px] text-palette-primary font-bold w-full line-clamp-2 break-words `}
          >
            {parsedPlaylistData.display_name}
          </h1>
          <h2 className=" text-xl md:text-3xl text-palette-primary">
            By - <span className="font-bold">{parsedUserData.username}</span>
          </h2>

          <article className="md:absolute bottom-40 w-[80%] h-fit flex flex-col md:flex-row flex-wrap gap-6 items-start md:items-center justify-evenly">
            <div className="w-fit h-full flex flex-row items-center justify-center gap-3">
              <Image
                src="/themes/default/views.png"
                width={50}
                height={50}
                className="object-contain"
                alt="Views"
              />
              <p className="text-palette-text text-lg md:text-2xl font-bold">
                {parsedViewData.length}
              </p>
            </div>
            <div className="w-fit h-full flex flex-row items-center justify-center gap-3">
              <Image
                src="/themes/default/likes.png"
                width={50}
                height={50}
                className="object-contain"
                alt="Views"
              />
              <p className="text-palette-text text-lg md:text-2xl font-bold">
                {spotifyPlaylist.followers.total}
              </p>
            </div>
            <div className="w-fit h-full flex flex-row items-center justify-center gap-3">
              <Image
                src="/themes/default/tracks.png"
                width={50}
                height={50}
                className="object-contain"
                alt="Views"
              />
              <p className="text-palette-text text-lg md:text-2xl font-bold">
                {spotifyPlaylist.tracks.total}
              </p>
            </div>
          </article>
          <div className="w-full h-fit p-3  md:absolute bottom-5 flex flex-col items-center justify-center shrink-0">
            <ChevronDownCircle className="text-3xl w-[30px] h-[30px] text-palette-secondary animate-bounce" />
          </div>
        </section>
        <TracksComponent
          playlistData={spotifyPlaylist}
          initialTracks={tracks}
          theme={parsedPlaylistData.theme}
        />
      </WidthWrapper>
    </section>
  );
}
