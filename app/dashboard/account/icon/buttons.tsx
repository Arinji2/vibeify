"use client";

import SaveAccountIconAction from "@/actions/account/icon";
import { useToast } from "@/utils/useToast";
import { Loader2, Repeat2 } from "lucide-react";
import { useRouter } from "next/navigation";
// @ts-ignore
import { experimental_useFormStatus as useFormStatus } from "react-dom";

// @ts-ignore
import { experimental_useFormState as useFormState } from "react-dom";

export function RerollButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        router.push(`/dashboard/account/icon?seed=${Math.random()}`);
      }}
      className="px-4 py-2 shadow-button hover:shadow-buttonHover border-[3px] bg-palette-tertiary border-black  flex flex-row gap-2 items-center justify-center"
    >
      <Repeat2 className="w-[100px] h-[100px] text-black font-medium" />
    </button>
  );
}

export function SaveButton({ seed }: { seed: string }) {
  const initialState = {
    message: "",
    status: 0,
  };

  const [prevState, action] = useFormState(SaveAccountIconAction, initialState);
  useToast({
    message: prevState.message,
    status: prevState.status,
    successMessage: "Icon saved successfully",
    successRoute: "/dashboard/playlists",
  });

  return (
    <form action={action}>
      <input type="hidden" name="seed" value={seed} />
      <Button />
    </form>
  );
}

function Button() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="px-4 py-2 shadow-button hover:shadow-buttonHover border-[3px] bg-palette-success border-black  flex flex-row gap-2 items-center justify-center"
    >
      {pending && (
        <Loader2 className="h-[25px] w-[25px] animate-spin text-black" />
      )}
      {""} <p className="text-[25px] text-black font-medium">Save Icon</p>
    </button>
  );
}
