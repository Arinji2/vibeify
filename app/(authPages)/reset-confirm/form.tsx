"use client";

import { ConfirmResetAction } from "@/actions/auth/reset/confirm";
import { CONSTRAINTS } from "@/utils/constraints";
import { useToast } from "@/utils/useToast";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useFormState } from "react-dom";
import { SubmitButton } from "./buttons";

export default function Form({ token }: { token: string | undefined }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const initialState = {
    status: 0,
    message: "",
    token: token,
  };

  const [prevState, action] = useFormState(ConfirmResetAction, initialState);
  useToast({
    message: prevState.message,
    status: prevState.status,
    successMessage: "Password Reset Successfully",
    successRoute: "/login",
  });
  return (
    <form
      className="flex h-full w-full flex-col items-center justify-start gap-3"
      action={action}
    >
      <div className="relative flex  bg-white   h-[50px] w-[95%] flex-row items-center justify-center border-[3px] border-black  text-black focus:border-4 focus:outline-0 md:w-[450px]">
        <input
          type={showPassword ? "text" : "password"}
          required
          minLength={CONSTRAINTS.PASSWORD.MIN_LENGTH}
          maxLength={CONSTRAINTS.PASSWORD.MAX_LENGTH}
          name="password"
          placeholder="Password"
          className=" flex h-full w-[85%] shrink-0 flex-col items-start justify-center  text-black focus:outline-none p-2 md:w-[400px]"
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
      <div className="relative flex  bg-white   h-[50px] w-[95%] flex-row items-center justify-center border-[3px] border-black  text-black focus:border-4 focus:outline-0 md:w-[450px]">
        <input
          type={showConfirmPassword ? "text" : "password"}
          required
          minLength={CONSTRAINTS.PASSWORD.MIN_LENGTH}
          maxLength={CONSTRAINTS.PASSWORD.MAX_LENGTH}
          name="passwordConfirm"
          placeholder="Confirm Password"
          className=" flex h-full w-[85%] shrink-0 flex-col items-start justify-center  text-black focus:outline-none p-2 md:w-[400px]"
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            setShowConfirmPassword(!showConfirmPassword);
          }}
          className="w-full h-full md:w-[50px] border-l-[3px] flex flex-col items-center justify-center border-black"
        >
          {showConfirmPassword ? (
            <Eye className="w-[20px] h-[20px]" />
          ) : (
            <EyeOff className="w-[20px] h-[20px]" />
          )}
        </button>
      </div>
      <SubmitButton />
    </form>
  );
}
