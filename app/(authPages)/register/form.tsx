"use client";

import { CONSTRAINTS } from "@/utils/constraints";
import { Register } from "./buttons";

import { RegisterAction } from "@/actions/auth/register";

// @ts-ignore
import { experimental_useFormState as useFormState } from "react-dom";

import { useToast } from "@/utils/useToast";
import { GithubOauthButton, GoogleOauthButton } from "../oauth/buttons";

export default function Form() {
  const initialState = {
    status: 0,
    message: "",
  };

  const [prevState, action] = useFormState(RegisterAction, initialState);

  useToast({
    status: prevState.status,
    message: prevState.message,
    successMessage: "User created successfully",
    successRoute: "/login",
  });

  return (
    <>
      <form
        action={action}
        className="flex h-full w-full flex-col items-center justify-start gap-3"
      >
        <div className="relative flex h-fit w-full flex-col items-center justify-center md:w-fit">
          <input
            type="email"
            required
            minLength={CONSTRAINTS.EMAIL.MIN_LENGTH}
            name="email"
            placeholder="Email"
            className=" flex h-[50px] w-[95%] flex-col items-start justify-center border-[3px] border-black p-2 text-black focus:border-4 focus:outline-0  md:w-[400px]"
          />
        </div>

        <div className="relative flex h-fit w-full flex-col items-center justify-center md:w-fit">
          <input
            type="text"
            required
            minLength={CONSTRAINTS.USERNAME.MIN_LENGTH}
            maxLength={CONSTRAINTS.USERNAME.MAX_LENGTH}
            name="username"
            placeholder="Username"
            className=" flex h-[50px] w-[95%] flex-col items-start justify-center border-[3px] border-black p-2 text-black focus:border-4 focus:outline-0  md:w-[400px]"
          />
        </div>
        <div className="relative flex h-fit w-full flex-col items-center justify-center md:w-fit">
          <input
            type="password"
            required
            minLength={CONSTRAINTS.PASSWORD.MIN_LENGTH}
            maxLength={CONSTRAINTS.PASSWORD.MAX_LENGTH}
            name="password"
            placeholder="Password"
            className=" flex h-[50px] w-[95%] flex-col items-start justify-center border-[3px] border-black p-2 text-black focus:border-4 focus:outline-0  md:w-[400px]"
          />
        </div>
        <div className="relative flex h-fit w-full flex-col items-center justify-center md:w-fit">
          <input
            type="password"
            required
            minLength={CONSTRAINTS.PASSWORD.MIN_LENGTH}
            maxLength={CONSTRAINTS.PASSWORD.MAX_LENGTH}
            name="confirm"
            placeholder="Confirm Password"
            className=" flex h-[50px] w-[95%] flex-col  items-start justify-center border-[3px] border-black p-2 text-black focus:border-4 focus:outline-0  md:w-[400px]"
          />
        </div>
        <Register />
      </form>
      <div className="flex h-full w-full flex-col items-center justify-start gap-3">
        <GoogleOauthButton />
        <GithubOauthButton />
      </div>
    </>
  );
}
