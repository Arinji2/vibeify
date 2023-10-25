import z from "zod";
import { UserSchema } from "./schema";
export type UserType = z.infer<typeof UserSchema>;
