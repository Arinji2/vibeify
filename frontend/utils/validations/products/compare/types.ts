import * as z from "zod";
import { CompareListSchema, CompareResultsSchema, CompareSchema } from "./schema";
export type ComparePlaylist = {
  name: string;
  id: string;
  image: string;
  link: string;
};

export type CompareListSchemaType = z.infer<typeof CompareListSchema>;
export type CompareSchemaType = z.infer<typeof CompareSchema>;
export type CompareResultsSchemaType = z.infer<typeof CompareResultsSchema>;
