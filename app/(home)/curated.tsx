import getSpotify from "@/utils/getSpotify";
import { likesFormat } from "@/utils/likesFormat";
import { readableTheme } from "@/utils/readableTheme";
import {
  PlaylistsSchema,
  ViewsSchema,
} from "@/utils/validations/playlists/schema";
import { PlaylistType } from "@/utils/validations/playlists/types";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import { Disc, Eye, Heart } from "lucide-react";
import { unstable_cache } from "next/cache";
import Link from "next/link";
import Pocketbase from "pocketbase";
import "react-lazy-load-image-component/src/effects/blur.css";
import WidthWrapper from "../(wrapper)/widthWrapper";
import { CardImage } from "./curated.client";

export async function CuratedPlaylists() {
  const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  const formattedData: PlaylistType[][] = await unstable_cache(
    async () => {
      pb.autoCancellation(false);

      const recordData = await pb.collection("playlists").getList(1, 100, {
        filter: "public = true",
        expand: "created_by",
      });

      const playlistSchema = PlaylistsSchema.parse(recordData.items);

      const formattedData: PlaylistType[][] = [];
      let localPlaylistList: PlaylistType[] = [];

      playlistSchema.forEach((playlist, index) => {
        localPlaylistList.push(playlist);

        if (
          localPlaylistList.length === 4 ||
          index === playlistSchema.length - 1
        ) {
          formattedData.push(localPlaylistList);
          localPlaylistList = [];
        }
      });

      return formattedData;
    },
    [],
    {
      tags: ["CuratedPlaylists"],
    }
  )();

  const spotify = await getSpotify();

  return (
    <section className="flex h-fit w-full flex-col  items-center justify-center bg-palette-accent py-10">
      <WidthWrapper>
        <div className="w-full h-fit gap-10  flex flex-col items-start justify-center">
          <div className="w-full h-fit gap-3 flex flex-col items-center justify-center">
            <h2 className="text-[50px] text-center xl:text-[70px] tracking-wide font-bold text-palette-background">
              Explore Curated Playlists
            </h2>
            <p className="text-[25px] text-opacity-90 text-palette-background text-center">
              Browse through a variety of user-created playlists, each with its
              own unique theme and style.
            </p>
          </div>
          <div className="w-full h-full flex flex-row items-center justify-start overflow-x-scroll small-scrollbar py-4 gap-10 xl:snap-x xl:snap-mandatory no">
            {formattedData.map((playlists, index) => (
              <div
                key={index}
                className="w-fit xl:w-full shrink-0 h-fit flex flex-row items-center xl:justify-between xl:px-2 justify-start xl:flex-wrap gap-10 snap-center"
              >
                {playlists.map((item) => (
                  <PlaylistCard
                    playlist={item}
                    key={item.id}
                    pbClient={pb}
                    spotifyClient={spotify}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </WidthWrapper>
    </section>
  );
}

async function PlaylistCard({
  playlist,
  loading,
  pbClient,
  spotifyClient,
}: {
  playlist: PlaylistType;
  loading?: boolean;
  pbClient: Pocketbase;
  spotifyClient: SpotifyApi;
}) {
  const viewData = await unstable_cache(
    async (id) => {
      const viewRecord = await pbClient.collection("views").getFullList({
        filter: `playlist_id = "${id}"`,
      });
      const parsedRecord = ViewsSchema.parse(viewRecord);
      return parsedRecord;
    },
    ["cache-key"],
    {
      tags: [`views${playlist.id}`],
    }
  )(playlist.id!);
  const spotifyData = await unstable_cache(
    async (link) => {
      const spotifyPlaylist = await spotifyClient.playlists.getPlaylist(
        link.split("/")[4]
      );
      return spotifyPlaylist;
    },
    ["cache-key"],
    {
      tags: [`spotify${playlist.id}`],
    }
  )(playlist.spotify_link);

  return (
    <Link
      href={`/${playlist.link}`}
      target="_blank"
      className="flex flex-row shrink-0 items-center justify-center p-4 gap-8 bg-palette-background border-[4px] border-black rounded-[10px] w-[560px] shadow-button h-[230px]"
    >
      <div className="w-[90%] h-full flex flex-col items-start justify-start gap-2">
        <h3 className="text-[25px] font-medium text-black line-clamp-2 text-left h-[75px]">
          {playlist.name}
        </h3>
        <div className="w-full h-fit flex flex-row  items-center justify-between">
          <div className="h-fit w-fit gap-2 flex flex-row items-center justify-center">
            <Heart
              className="w-[30px] h-[30px] text-palette-accent"
              fill="#C1DCC9"
              strokeWidth={2}
            />
            <p className="text-palette-text text-xl font-bold">
              {likesFormat(spotifyData.followers.total)}
            </p>
          </div>
          <div className="h-fit w-fit gap-2 flex flex-row items-center justify-center">
            <Eye
              className="w-[30px] h-[30px] text-palette-accent"
              fill="#C1DCC9"
              strokeWidth={2}
            />
            <p className="text-palette-text text-xl font-bold">
              {viewData.length}
            </p>
          </div>{" "}
          <div className="h-fit w-fit gap-2 flex flex-row items-center justify-center">
            <Disc
              className="w-[30px] h-[30px] text-palette-accent"
              fill="#C1DCC9"
              strokeWidth={2}
            />

            <p className="text-palette-text text-xl font-bold">
              {spotifyData.tracks.total}
            </p>
          </div>
        </div>
        <p className="text-palette-text text-lg">
          Theme:{" "}
          <span className="font-bold text-palette-accent">
            {readableTheme(playlist.theme)}
          </span>
        </p>
        <p className="text-palette-text text-lg">
          By:{" "}
          <span className="font-bold">
            {typeof playlist.created_by === "object"
              ? playlist.created_by.username
              : "Unknown"}
          </span>
        </p>
      </div>
      <CardImage playlistImage={playlist.image} playlistID={playlist.id!} />
    </Link>
  );
}
