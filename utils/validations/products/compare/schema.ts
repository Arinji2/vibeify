import z from "zod";

// export const CompareSchema = z.object({
//   id: z.string(),
//   link: z.string(),
//   spotifyLink1: z.string(),
//   spotifyLink2: z.string(),
// });


export const CompareResultsSchema = z.object({
  common: z.array(z.string()),
  missingIn1: z.array(z.string()),
  missingIn2: z.array(z.string()),
});


export const CompareSchema = z.object({
  id : z.string(),
  user: z.string(),
 playlist1: z.string(),
 playlist2: z.string(),
 shareLink: z.string(),
 results: CompareResultsSchema.or(z.literal(null)),

});


export const CompareListSchema = z.array(CompareSchema);