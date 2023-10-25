"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import WidthWrapper from "../(wrapper)/widthWrapper";

export default function Navbar({
  border,
  icon,
}: {
  border?: boolean;
  icon: number;
}) {
  let path = usePathname();
  path = path.split("/")[2];
  let safePath = path as "products" | "playlists" | "account";
  const [active, setActive] = useState(false);

  return (
    <nav
      className={`${
        border && "border-b-4 border-black "
      } sticky top-0 z-[60] flex h-[80px] w-full flex-col items-center justify-center bg-palette-background md:h-[130px]`}
    >
      <WidthWrapper>
        <div className="flex h-full w-full flex-row items-center justify-between">
          <Link
            href="/"
            className="relative h-[25.5px] w-[100px] xl:h-[51px] xl:w-[200px]"
          >
            <Image
              src="/logo.png"
              alt="Logo"
              fill
              sizes=" (min-width: 1280px) 200px, 100px"
              className="object-contain"
            />
          </Link>
          <ul className="hidden h-fit w-fit flex-row  items-center justify-center gap-8 md:flex">
            <Link
              href="/products"
              className="group flex h-fit w-fit flex-col items-start justify-center gap-1"
            >
              <p className="text-xl font-medium text-palette-text xl:text-3xl">
                Products
              </p>
              <div
                className={`${
                  safePath === "products"
                    ? "w-full "
                    : "w-0 group-hover:w-full "
                } h-[3px] origin-left  bg-black transition-all duration-500 ease-in-out`}
              ></div>
            </Link>
            <Link
              href="/playlists"
              className="group flex h-fit w-fit flex-col items-start justify-center gap-1"
            >
              <p className="text-xl font-medium text-palette-text xl:text-3xl">
                Playlists
              </p>
              <div
                className={`${
                  safePath === "playlists"
                    ? "w-full "
                    : "w-0 group-hover:w-full "
                } h-[3px] origin-left  bg-black transition-all duration-500 ease-in-out`}
              ></div>
            </Link>
            <Link
              href="/account"
              className="group flex h-fit w-fit flex-col items-start justify-center gap-1"
            >
              <p className="text-xl font-medium text-palette-text xl:text-3xl">
                Account
              </p>
              <div
                className={`${
                  safePath === "account" ? "w-full " : "w-0 group-hover:w-full "
                } h-[3px] origin-left  bg-black transition-all duration-500 ease-in-out`}
              ></div>
            </Link>
          </ul>
          <Link
            href="/account/icon"
            className="hidden h-[70px] rounded-full overflow-hidden w-[70px] border-[3px] border-black bg-palette-tertiary p-[10px] md:block"
          ></Link>
          <div
            className="relative z-50 flex h-[50px] w-[50px] flex-col items-center justify-center gap-1 md:hidden"
            onClick={() => {
              setActive(!active);
            }}
          >
            <div
              className={`${
                active ? "top-4 -rotate-45 " : "top-2 rotate-0 "
              }bg-black absolute right-0 h-[4px] w-[37px] transition-all duration-500 ease-in-out`}
            ></div>
            <div
              className={`${
                active ? "opacity-0 " : "opacity-100 "
              } absolute right-0 top-4 h-[4px] w-[37px] bg-black transition-all duration-500 ease-in-out`}
            ></div>
            <div
              className={`${
                active ? "top-4 rotate-45 " : "top-6 rotate-0 "
              }bg-black absolute right-0 h-[4px] w-[37px] transition-all duration-500 ease-in-out`}
            ></div>
          </div>
        </div>
      </WidthWrapper>
      <div
        className={`${
          active ? "translate-x-0 " : "translate-x-full "
        }md:hidden fixed right-0 top-0 flex h-screen w-[70%]  flex-col items-center justify-center bg-palette-accent transition-all duration-500 ease-in-out`}
      >
        <ul className="flex h-fit w-fit flex-col  items-center justify-center gap-8 md:hidden">
          <Link
            href="/products"
            className="group flex h-fit w-fit flex-col items-start justify-center gap-1"
          >
            <p className="text-2xl font-bold  text-palette-background">
              products
            </p>
            <div
              className={`${
                safePath === "products" ? "w-full " : "w-0 group-hover:w-full "
              } h-[3px] origin-left  bg-white transition-all duration-500 ease-in-out`}
            ></div>
          </Link>
          <Link
            href="/playlists"
            className="group flex h-fit w-fit flex-col items-start justify-center gap-1"
          >
            <p className="text-2xl font-bold  text-palette-background">
              Playlists
            </p>
            <div
              className={`${
                safePath === "playlists" ? "w-full " : "w-0 group-hover:w-full "
              } h-[3px] origin-left  bg-white transition-all duration-500 ease-in-out`}
            ></div>
          </Link>
          <Link
            href="/account"
            className="group flex h-fit w-fit flex-col items-start justify-center gap-1"
          >
            <p className="text-2xl font-bold  text-palette-background">
              Account
            </p>
            <div
              className={`${
                safePath === "account" ? "w-full " : "w-0 group-hover:w-full "
              } h-[3px] origin-left  bg-white transition-all duration-500 ease-in-out`}
            ></div>
          </Link>
        </ul>
      </div>
    </nav>
  );
}
