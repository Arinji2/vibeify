"use server";

import { RegisterFormSchema } from "@/utils/validations/auth/schema";
import { RegisterFormType } from "@/utils/validations/auth/types";
import Pocketbase from "pocketbase";

export async function RegisterAction(prevState: any, formData: FormData) {
  const form = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    passwordConfirm: formData.get("confirm") as string,
    username: formData.get("username") as string,
  } as RegisterFormType;

  const parsedForm = RegisterFormSchema.safeParse(form);

  if (!parsedForm.success)
    return {
      status: 400,
      message: parsedForm.error.issues[0].message,
    };

  const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  try {
    await pb.collection("users").create(form);
  } catch (error: any) {
    return {
      status: 400,
      message: error.message,
    };
  }

  return {
    status: 200,
    message: "User created successfully",
  };
}
