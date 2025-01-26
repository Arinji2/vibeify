import Image from "next/image";
import Link from "next/link";
import { RerollButton, SaveButton } from "./buttons";

export default async function Page({
  searchParams,
}: {
  searchParams: { [seed: string]: string | undefined };
}) {
  return (
    <main className="md:min-h-excludeNav min-h-excludeMobNav bg-palette-accent w-full flex flex-col items-center justify-center">
      <div className="w-full h-fit flex flex-col items-center justify-center">
        <h1 className="text-white font-bold text-[40px] text-center md:text-[50px]">
          Account Icon
        </h1>
        <div className="w-full h-full flex flex-col md:flex-row items-center justify-center mt-10 gap-10">
          <div className="xl:w-[300px] md:w-[200px] w-[90%] aspect-square rounded-md overflow-hidden relative">
            <Image
              src={`https://api.dicebear.com/7.x/open-peeps/svg?seed=${searchParams.seed}`}
              alt="Avatar"
              fill
            />
          </div>
          <div className="w-fit h-full flex flex-col items-center justify-start gap-10">
            <RerollButton />
            <SaveButton seed={searchParams.seed?.toString()!} />
          </div>
        </div>
      </div>
    </main>
  );
}
