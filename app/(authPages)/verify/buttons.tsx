"use client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Pocketbase from "pocketbase";
import Client from "pocketbase";
import * as React from "react";
import { useState } from "react";
import { toast } from "react-toastify";

export function SendEmailButton({
  isVerified,
  email,
}: {
  isVerified: "null" | "true" | "false";
  email: string;
}) {
  const [pending, setPending] = useState(false);
  const router = useRouter();
  React.useEffect(() => {
    if (isVerified === "null") return;
    if (isVerified === "true") {
      toast.success("Email verified!");
      router.push("/login");
    }
    if (isVerified === "false") {
      toast.error("Invalid token!");
      router.push("/verify");
    }
  }, [isVerified, router]);
  return (
    <button
      disabled={pending}
      onClick={async () => {
        if (pending) return;
        setPending(true);
        try {
          const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
          await pb.collection("users").requestVerification(email);
          toast.success("Verification Email Sent");
        } catch (e) {
          toast.error("Something went wrong");
          console.log(e);
        } finally {
          setPending(false);
        }
      }}
      className="flex h-fit w-[90%] grow-0 flex-col items-center justify-center gap-2 border-[3px] border-black bg-palette-tertiary p-3 text-[20px] font-medium text-black shadow-[4px_4px_0_#000] transition-all duration-300 ease-in-out will-change-transform hover:scale-95 hover:shadow-[2px_2px_0_#000] disabled:bg-slate-500 disabled:text-slate-400  md:w-[400px] md:flex-row xl:w-[550px]"
    >
      {pending && (
        <Loader2 className="h-[20px] w-[20px] animate-spin text-black" />
      )}{" "}
      Send Verification Email
    </button>
  );
}
