import getSpotify from "@/utils/getSpotify";
import { UserSchema } from "@/utils/validations/account/schema";
import {
  PlaylistSchema,
  TrackSchema,
  ViewsSchema,
} from "@/utils/validations/playlists/schema";
import { TrackType } from "@/utils/validations/playlists/themes";
import { PlaylistedTrack, Track } from "@spotify/web-api-ts-sdk";
import { ChevronDownCircle } from "lucide-react";
import {
  Cabin_Condensed,
  IBM_Plex_Mono,
  Press_Start_2P,
} from "next/font/google";
import Image from "next/image";
import { getPlaiceholder } from "plaiceholder";
import Pocketbase from "pocketbase";
import WidthWrapper from "../(wrapper)/widthWrapper";
import TracksComponent from "./tracksComp";

const iBM_Plex_Mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

const press_Start_2P = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
});

const cabin_Condensed = Cabin_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default async function Page({
  params,
}: {
  params: { playlistLink: string };
}) {
  const playlistLink = params.playlistLink;
  const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  const data = await pb
    .collection("playlists")
    .getFirstListItem(`link = "${playlistLink}"`);

  const parsedPlaylistData = PlaylistSchema.parse(data);

  const userRecord = await pb
    .collection("users")
    .getOne(parsedPlaylistData.created_by);

  const viewRecord = await pb.collection("views").getFullList({
    filter: `playlist_id = "${parsedPlaylistData.id}"`,
  });

  const parsedViewData = ViewsSchema.parse(viewRecord);

  const parsedUserData = UserSchema.parse(userRecord);
  const spotify = await getSpotify();
  const spotifyPlaylist = await spotify.playlists.getPlaylist(
    parsedPlaylistData.spotify_link.split("/")[4].split("?")[0]
  );

  const spotifyTracks = await spotify.playlists.getPlaylistItems(
    spotifyPlaylist.id,
    undefined,
    undefined,
    50,
    0
  );
  const fetchTrackData = async (item: PlaylistedTrack) => {
    if ((item.track as Track).album.artists) {
      const buffer = await fetch(
        (item.track as Track).album.images[0].url
      ).then(async (res) => Buffer.from(await res.arrayBuffer()));

      const { base64 } = await getPlaiceholder(buffer);

      (item.track as unknown as TrackType).blurDataURL = base64;

      const parsedTrack = TrackSchema.parse(item.track);

      return parsedTrack as TrackType;
    } else {
      return null;
    }
  };

  const trackPromises = spotifyTracks.items.map(fetchTrackData);

  const resolvedTracks = await Promise.all(trackPromises);

  const tracks = resolvedTracks.filter(
    (track) => track !== null
  ) as TrackType[];
  return (
    <section className="w-full h-fit relative bg-[url('../public/default-bg.png')] bg-repeat bg-palette-background text-center ">
      <WidthWrapper>
        <section className="w-full h-[90svh] relative md:h-[100svh] flex flex-col items-center justify-center pb-10 gap-4">
          <h1
            className={`text-[60px] md:text-[80px] xl:text-[120px] text-palette-primary font-bold`}
          >
            {parsedPlaylistData.display_name}
          </h1>
          <h2 className=" text-xl md:text-3xl text-palette-primary">
            By - <span className="font-bold">{parsedUserData.username}</span>
          </h2>

          <article className="absolute bottom-40 w-[80%] h-fit flex flex-row flex-wrap gap-6 items-center justify-evenly">
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
          <div className="w-full h-fit p-3  absolute bottom-5 flex flex-col items-center justify-center shrink-0">
            <ChevronDownCircle className="text-3xl w-[30px] h-[30px] text-palette-secondary animate-bounce" />
          </div>
        </section>
        <TracksComponent
          playlistData={spotifyPlaylist}
          initialTracks={tracks}
        />
      </WidthWrapper>
    </section>
  );
}
