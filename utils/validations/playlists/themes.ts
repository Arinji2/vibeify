import z from "zod";
import { TrackSchema } from "./schema";
export const THEMES = ["default", "neo-brutalism", "pixel"] as const;

export type ThemesType = "default" | "neo-brutalism" | "pixel";
export type TrackType = z.infer<typeof TrackSchema>;
