"use client";

import { CONSTRAINTS } from "@/utils/constraints";
import { Login, Reset } from "./buttons";
import { useFormState } from "react-dom";

import { LoginAction } from "@/actions/auth/login";
import { useToast } from "@/utils/useToast";
import { GithubOauthButton, GoogleOauthButton } from "../oauth/buttons";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Form() {
  const initialState = {
    status: 0,
    message: "",
  };
  const [prevState, loginAction] = useFormState(LoginAction, initialState);
  const [showPassword, setShowPassword] = useState(false);

  useToast({
    status: prevState.status,
    message: prevState.message,
    successMessage: "User logged in successfully",
    successRoute: "/dashboard/playlists",
  });

  return (
    <>
      <form
        action={loginAction}
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
        <div className="relative flex  bg-white   h-[50px] w-[95%] flex-row items-center justify-center border-[3px] border-black  text-black focus:border-4 focus:outline-0 md:w-[400px]">
          <input
            type={showPassword ? "text" : "password"}
            required
            minLength={CONSTRAINTS.PASSWORD.MIN_LENGTH}
            maxLength={CONSTRAINTS.PASSWORD.MAX_LENGTH}
            name="password"
            placeholder="Password"
            className=" flex h-full w-[85%] shrink-0 flex-col items-start justify-center  text-black focus:outline-none p-2 md:w-[350px]"
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              setShowPassword(!showPassword);
            }}
            className="w-full h-full md:w-[50px] border-l-[3px] flex flex-col items-center justify-center border-black"
          >
            {showPassword ? (
              <Eye className="w-[20px] h-[20px]" />
            ) : (
              <EyeOff className="w-[20px] h-[20px]" />
            )}
          </button>
        </div>

        <Login />
        <div className="flex h-full w-full flex-col items-center justify-start gap-3">
          <Reset />
        </div>
      </form>

      <div className="flex h-full w-full flex-col items-center justify-start gap-3">
        <GoogleOauthButton />
        <GithubOauthButton />
      </div>
      <div className="flex h-full w-full flex-col items-center justify-start gap-3 mt-5">
        <Link
          href="/register"
          className="text-xl font-medium text-black border-b-4 border-black"
        >
          Sign Up Instead
        </Link>
      </div>
    </>
  );
}
