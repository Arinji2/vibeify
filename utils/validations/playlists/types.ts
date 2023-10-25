import {
  CreatePlaylistSchema,
  PlaylistSchema,
  SongSchema,
  SyncSchema,
  ViewSchema,
} from "./schema";
import z from "zod";

export type PlaylistFormType = z.infer<typeof CreatePlaylistSchema>;
export type PlaylistType = z.infer<typeof PlaylistSchema>;
export type SyncType = z.infer<typeof SyncSchema>;
export type SongType = z.infer<typeof SongSchema>;
export type ViewType = z.infer<typeof ViewSchema>;
