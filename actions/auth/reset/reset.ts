"use server";

import { SendPasswordResetFormSchema } from "@/utils/validations/auth/schema";
import { SendPasswordResetFormType } from "@/utils/validations/auth/types";
import Pocketbase from "pocketbase";

export async function ResetAction({ email }: { email: string }) {
  const form = {
    email,
  } as SendPasswordResetFormType;

  const parsedForm = SendPasswordResetFormSchema.safeParse(form);

  if (!parsedForm.success)
    return {
      status: 400,
      message: parsedForm.error.issues[0].message,
    };

  const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  try {
    pb.collection("users").requestPasswordReset(parsedForm.data.email);

    return {
      status: 200,
      message: "Password Reset Email Sent",
    };
  } catch (error: any) {
    return {
      status: 400,
      message: "Email Not Found",
    };
  }
}
