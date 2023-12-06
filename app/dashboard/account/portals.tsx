"use client";
import ChangeUsernameModal from "@/app/(models)/changeUsernameModal";
import * as React from "react";
import { useState } from "react";
import { createPortal } from "react-dom";

export function UpdateUsername({ serverData }: { serverData: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-2 text-center py-2 h-full flex flex-col items-center justify-center bg-palette-background shadow-button border-[4px] border-black"
      >
        <p className="text-[35px] md:text-[40px] text-black font-medium">
          Change <span className="font-bold inline">Username</span>
        </p>
      </button>
      {isOpen &&
        createPortal(
          <ChangeUsernameModal serverData={serverData} setIsOpen={setIsOpen} />,
          document.body
        )}
    </>
  );
}
