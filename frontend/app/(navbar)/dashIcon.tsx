"use client";

import Image from "next/image";
import Link from "next/link";

export default function DashIcon({
  seed,
  isMob,
  setActive,
}: {
  seed?: string;
  isMob?: boolean;
  setActive?: Function;
}) {
  const locSeed = seed ? seed : Math.random();
  return (
    <Link
      onClick={() => {
        if (isMob) setActive!(false);
      }}
      href={`/dashboard/account/icon?seed=${locSeed}`}
      draggable={false}
      className=" h-[90px] md:h-[70px] relative rounded-full overflow-hidden aspect-square shrink-0 border-[3px] border-black bg-palette-tertiary p-[10px] md:block"
    >
      <Image
        src={`https://api.dicebear.com/7.x/open-peeps/svg?seed=${locSeed}`}
        alt="Avatar"
        fill
        sizes="90px"
        draggable={false}
      />
    </Link>
  );
}
