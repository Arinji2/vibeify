import * as z from "zod";
import { CompareSchema } from "./schema";
export type ComparePlaylist = {
  name: string;
  id: string;
  image: string;
  link: string;
};

export type PocketbaseCompareData = z.infer<typeof CompareSchema>;
