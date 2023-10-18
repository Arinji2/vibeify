"use server";

import { LoginFormSchema } from "@/utils/validations/auth/schema";
import { LoginFormType } from "@/utils/validations/auth/types";
import { cookies } from "next/headers";
import Pocketbase from "pocketbase";

export async function LoginAction(prevState: any, formData: FormData) {
  const form = {
    user: formData.get("user") as string,
    password: formData.get("password") as string,
  } as LoginFormType;

  const parsedForm = LoginFormSchema.safeParse(form);

  if (!parsedForm.success)
    return {
      status: 400,
      message: parsedForm.error.issues[0].message,
    };

  const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  try {
    const { token, record: model } = await pb
      .collection("users")
      .authWithPassword(parsedForm.data.user, parsedForm.data.password);

    const cookie = JSON.stringify({ token, model });

    cookies().set("pb_auth", cookie, {
      secure: true,
      path: "/",
      sameSite: "strict",
      httpOnly: true,
    });
  } catch (error: any) {
    console.log(error);
    return {
      status: 400,
      message: error.message,
    };
  }

  return {
    status: 200,
    message: "User logged in successfully",
  };
}
