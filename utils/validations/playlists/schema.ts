import { CONSTRAINTS } from "@/utils/constraints";
import z from "zod";
import { THEMES } from "./themes";
export const CreatePlaylistSchema = z.object({
  spotifyLink: z.string().url(),
  privateName: z
    .string()
    .min(
      CONSTRAINTS.PLAYLIST.MIN_LENGTH,
      `Private Name must be ${CONSTRAINTS.PLAYLIST.MAX_LENGTH} long`
    )
    .max(
      CONSTRAINTS.PLAYLIST.MAX_LENGTH,
      `Private Name must be ${CONSTRAINTS.PLAYLIST.MAX_LENGTH} long`
    ),
  displayName: z
    .string()
    .min(
      CONSTRAINTS.PLAYLIST.MIN_LENGTH,
      `Display Name must be ${CONSTRAINTS.PLAYLIST.MAX_LENGTH} long`
    )
    .max(
      CONSTRAINTS.PLAYLIST.MAX_LENGTH,
      `Display Name must be ${CONSTRAINTS.PLAYLIST.MAX_LENGTH} long`
    ),

  displayNameSync: z.number().min(0).max(1),
  displayLink: z
    .string()
    .min(
      CONSTRAINTS.PLAYLIST.MIN_LENGTH,
      `Display Link must be ${CONSTRAINTS.PLAYLIST.MAX_LENGTH} long`
    )
    .max(
      CONSTRAINTS.PLAYLIST.MAX_LENGTH,
      `Display Link must be ${CONSTRAINTS.PLAYLIST.MAX_LENGTH} long`
    )
    .refine((data) => !data.startsWith("vibeify.arinji.com"), {
      message: "Display link cannot start with vibeify.arinji.com",
      path: ["displayLink"],
    }),
  displayLinkSync: z.number().min(0).max(1),
  displayPicture: z
    .any()
    .refine((files) => files?.length == 1, "File is required."),
  displayPictureSync: z.number().min(0).max(1),
  weeklySync: z.number().min(0).max(1),
  publicPlaylist: z.number().min(0).max(1),
});

export const PlaylistSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  link: z.string(),
  public: z.boolean(),
  image: z.string(),
  spotify_link: z.string().url(),
  created_by: z.string(),
  display_name: z.string(),
  theme: z.enum(THEMES),
});

export const PlaylistsSchema = z.array(PlaylistSchema);

export const SyncSchema = z.object({
  id: z.string().optional(),
  displayNameSync: z.boolean(),
  displayLinkSync: z.boolean(),
  displayPictureSync: z.boolean(),
  weeklySync: z.boolean(),
  playlist: z.string(),
  updated: z.string(),
});

export const SongSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  link: z.string(),
  spotify_id: z.string(),
  playlist: z.string(),
  spotify_image: z.string().url(),
  artist: z.string(),
});

export const ViewSchema = z.object({
  id: z.string().optional(),
  playlist_id: z.string(),
  ip: z.string(),
  created: z.string(),
  updated: z.string(),
});

export const ViewsSchema = z.array(ViewSchema);

const ArtistSchema = z.object({
  name: z.string(),
  id: z.string(),
  external_urls: z.object({
    spotify: z.string().url(),
  }),
});
const ImageSchema = z.object({
  url: z.string(),
  height: z.number(),
  width: z.number(),
});

export const TrackSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  external_urls: z.object({
    spotify: z.string().url(),
  }),

  album: z.object({
    images: z.array(ImageSchema),
    artists: z.array(ArtistSchema),
  }),
});
