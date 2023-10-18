"use client";
import { Loader2 } from "lucide-react";
import * as React from "react";
import { useState } from "react";
import { GithubOauth, GoogleOauth } from "./client";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export function GoogleOauthButton() {
  const [pending, setPending] = useState(false);
  const router = useRouter();
  return (
    <button
      disabled={pending}
      onClick={async () => {
        if (pending) return;
        setPending(true);
        const res = await GoogleOauth();
        if (res === 200) {
          toast.success("User logged in successfully");
          router.push("/dashboard");
        }

        setPending(false);
      }}
      className="flex h-[50px] w-[95%] flex-row items-center justify-center gap-2 border-[3px] border-black bg-palette-tertiary text-[20px] font-medium text-black shadow-[4px_4px_0_#000] md:w-[400px]"
    >
      {pending && (
        <Loader2 className="h-[20px] w-[20px] animate-spin text-black" />
      )}
      Login with Google
    </button>
  );
}

export function GithubOauthButton() {
  const [pending, setPending] = useState(false);
  const router = useRouter();
  return (
    <button
      disabled={pending}
      onClick={async () => {
        if (pending) return;
        setPending(true);
        const res = await GithubOauth();
        if (res === 200) {
          toast.success("User logged in successfully");
          router.push("/dashboard");
        }

        setPending(false);
      }}
      className="flex h-[50px] w-[95%] flex-row items-center justify-center gap-2 border-[3px] border-black bg-palette-tertiary text-[20px] font-medium text-black shadow-[4px_4px_0_#000] md:w-[400px]"
    >
      {pending && (
        <Loader2 className="h-[20px] w-[20px] animate-spin text-black" />
      )}
      Login with Github
    </button>
  );
}
