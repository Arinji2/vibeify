"use server";

import { ResetPasswordFormSchema } from "@/utils/validations/auth/schema";
import { ResetFormType } from "@/utils/validations/auth/types";
import Pocketbase from "pocketbase";

export async function ConfirmResetAction(prevState: any, formData: FormData) {
  const form = {
    password: formData.get("password"),
    token: prevState.token.split("=")[1],
    passwordConfirm: formData.get("passwordConfirm"),
  } as ResetFormType;

  const parsedForm = ResetPasswordFormSchema.safeParse(form);

  if (!parsedForm.success)
    return {
      status: 400,
      message: parsedForm.error.issues[0].message,
      token: form.token,
    };

  const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

  try {
    await pb
      .collection("users")
      .confirmPasswordReset(
        parsedForm.data.token,
        parsedForm.data.password,
        parsedForm.data.passwordConfirm
      );

    return {
      status: 200,
      message: "Password Reset Successfully",
      token: parsedForm.data.token,
    };
  } catch (error: any) {
    console.log(error.originalError.data.data);
    return {
      status: 400,
      message: "Password Reset Failed",
      token: parsedForm.data.token,
    };
  }
}
