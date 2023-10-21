"use client";

import { ResetAction } from "@/actions/auth/reset/reset";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

export function Form() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  return (
    <form className="flex h-full w-full flex-col items-center justify-start gap-3">
      <div className="relative flex h-fit w-full flex-col items-center justify-center md:w-fit">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          name="email"
          placeholder="Email"
          className=" flex h-[50px] w-[95%] flex-col items-start justify-center border-[3px] border-black p-2 text-black focus:border-4 focus:outline-0  md:w-[400px]"
        />
      </div>
      <button
        onClick={async (e) => {
          setLoading(true);
          e.preventDefault();
          const res = await ResetAction({ email });
          if (res.status === 200) toast.success("Email sent successfully");
          else toast.error("Email Not Found");
          setLoading(false);
        }}
        disabled={loading}
        className="flex h-fit w-[90%] grow-0 flex-col items-center justify-center gap-2 border-[3px] border-black bg-palette-tertiary p-3 text-[20px] font-medium text-black shadow-[4px_4px_0_#000] transition-all duration-300 ease-in-out will-change-transform hover:scale-95 hover:shadow-[2px_2px_0_#000] disabled:bg-slate-500 disabled:text-slate-400  md:w-[400px] md:flex-row xl:w-[550px]"
      >
        {loading && (
          <Loader2 className="h-[20px] w-[20px] animate-spin text-black" />
        )}{" "}
        Send Verification Email
      </button>
    </form>
  );
}
