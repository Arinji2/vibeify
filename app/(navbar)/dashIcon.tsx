"use client";

import Image from "next/image";
import Link from "next/link";

export default function DashIcon({ seed }: { seed?: string }) {
  const locSeed = seed ? seed : Math.random();
  return (
    <Link
      href={`/dashboard/account/icon?seed=${locSeed}`}
      draggable={false}
      className="hidden h-[70px] relative rounded-full overflow-hidden w-[70px] border-[3px] border-black bg-palette-tertiary p-[10px] md:block"
    >
      <Image
        src={`https://api.dicebear.com/7.x/open-peeps/svg?seed=${locSeed}`}
        alt="Avatar"
        fill
        draggable={false}
      />
    </Link>
  );
}
