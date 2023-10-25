import z from "zod";

export const UserSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string(),
  dicebear: z.string(),
  verified: z.boolean(),
});
