"use client";
import Image from "next/image";
import WidthWrapper from "../(wrapper)/widthWrapper";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar({ border }: { border?: boolean }) {
  let path = usePathname();
  path = path.split("/")[1];
  let safePath = path as "faq" | "about" | "support";
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
              href="/faq"
              className="group flex h-fit w-fit flex-col items-start justify-center gap-1"
            >
              <p className="text-xl font-medium text-palette-text xl:text-3xl">
                FAQ
              </p>
              <div
                className={`${
                  safePath === "faq" ? "w-full " : "w-0 group-hover:w-full "
                } h-[3px] origin-left  bg-black transition-all duration-500 ease-in-out`}
              ></div>
            </Link>
            <Link
              href="/about"
              className="group flex h-fit w-fit flex-col items-start justify-center gap-1"
            >
              <p className="text-xl font-medium text-palette-text xl:text-3xl">
                About
              </p>
              <div
                className={`${
                  safePath === "about" ? "w-full " : "w-0 group-hover:w-full "
                } h-[3px] origin-left  bg-black transition-all duration-500 ease-in-out`}
              ></div>
            </Link>
            <Link
              href="/support"
              className="group flex h-fit w-fit flex-col items-start justify-center gap-1"
            >
              <p className="text-xl font-medium text-palette-text xl:text-3xl">
                Support
              </p>
              <div
                className={`${
                  safePath === "support" ? "w-full " : "w-0 group-hover:w-full "
                } h-[3px] origin-left  bg-black transition-all duration-500 ease-in-out`}
              ></div>
            </Link>
          </ul>
          <Link
            href="/register"
            className="hidden h-fit w-fit border-[3px] border-black bg-palette-tertiary p-[10px] md:block"
          >
            <p className="text-xl font-medium text-palette-text xl:text-3xl">
              Start Playing
            </p>
          </Link>
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
            href="/faq"
            className="group flex h-fit w-fit flex-col items-start justify-center gap-1"
          >
            <p className="text-2xl font-bold  text-palette-background">FAQ</p>
            <div
              className={`${
                safePath === "faq" ? "w-full " : "w-0 group-hover:w-full "
              } h-[3px] origin-left  bg-white transition-all duration-500 ease-in-out`}
            ></div>
          </Link>
          <Link
            href="/about"
            className="group flex h-fit w-fit flex-col items-start justify-center gap-1"
          >
            <p className="text-2xl font-bold  text-palette-background">About</p>
            <div
              className={`${
                safePath === "about" ? "w-full " : "w-0 group-hover:w-full "
              } h-[3px] origin-left  bg-white transition-all duration-500 ease-in-out`}
            ></div>
          </Link>
          <Link
            href="/support"
            className="group flex h-fit w-fit flex-col items-start justify-center gap-1"
          >
            <p className="text-2xl font-bold  text-palette-background">
              Support
            </p>
            <div
              className={`${
                safePath === "support" ? "w-full " : "w-0 group-hover:w-full "
              } h-[3px] origin-left  bg-white transition-all duration-500 ease-in-out`}
            ></div>
          </Link>
        </ul>
      </div>
    </nav>
  );
}
