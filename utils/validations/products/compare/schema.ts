import z from "zod";

export const CompareSchema = z.object({
  id: z.string(),
  link: z.string(),
  spotifyLink1: z.string(),
  spotifyLink2: z.string(),
});
