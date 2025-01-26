"use client";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

export function SendEmailButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex h-fit w-[90%] grow-0 flex-col items-center justify-center gap-2 border-[3px] border-black bg-palette-tertiary p-3 text-[20px] font-medium text-black shadow-[4px_4px_0_#000] transition-all duration-300 ease-in-out will-change-transform hover:scale-95 hover:shadow-[2px_2px_0_#000] disabled:bg-slate-500 disabled:text-slate-400  md:w-[400px] md:flex-row xl:w-[550px]"
    >
      {pending && (
        <Loader2 className="h-[20px] w-[20px] animate-spin text-black" />
      )}{" "}
      Send Verification Email
    </button>
  );
}
