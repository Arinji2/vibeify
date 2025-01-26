import z from "zod";
import {
  LoginFormSchema,
  RegisterFormSchema,
  ResetPasswordFormSchema,
  SendPasswordResetFormSchema,
} from "./schema";

export type RegisterFormType = z.infer<typeof RegisterFormSchema>;
export type LoginFormType = z.infer<typeof LoginFormSchema>;
export type SendPasswordResetFormType = z.infer<
  typeof SendPasswordResetFormSchema
>;
export type ResetFormType = z.infer<typeof ResetPasswordFormSchema>;
