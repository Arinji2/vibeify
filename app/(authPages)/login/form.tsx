"use client";

import { CONSTRAINTS } from "@/utils/constraints";
import { Login } from "./buttons";

import { useFormState } from "react-dom";

import { LoginAction } from "@/actions/auth/login";
import { useToast } from "@/utils/useToast";

export default function Form() {
  const initialState = {
    status: 0,
    message: "",
  };
  const [prevState, action] = useFormState(LoginAction, initialState);

  useToast({
    status: prevState.status,
    message: prevState.message,
    successMessage: "User logged in successfully",
    successRoute: "/dashboard",
  });

  return (
    <>
      <form
        action={action}
        className="flex h-full w-full flex-col items-center justify-start gap-3"
      >
        <div className="relative flex h-fit w-full flex-col items-center justify-center md:w-fit">
          <input
            type="text"
            required
            name="user"
            placeholder="Username or Email"
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

        <Login />
      </form>
      <div className="flex h-full w-full flex-col items-center justify-start gap-3">
        {/*<LoginWithGoogle />
        <LoginWithGithub />*/}
      </div>
    </>
  );
}
