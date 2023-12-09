import WidthWrapper from "@/app/(wrapper)/widthWrapper";
import { getToken } from "@/utils/getToken";
import Image from "next/image";
import Link from "next/link";
import Pocketbase from "pocketbase";
import { DeleteAccount, DeletePlaylists, UpdateUsername } from "./portals";

export default async function Page() {
  const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  const token = await getToken();
  pb.authStore.save(token);
  await pb.collection("users").authRefresh();

  return (
    <div className="xl:min-h-excludeNav w-full bg-palette-accent min-h-excludeMobNav flex flex-col items-center gap-5 justify-start py-4">
      <h1 className="text-palette-background font-bold md:text-[60px] text-[45px] xl:text-[70px] text-center">
        Account Settings
      </h1>
      <WidthWrapper>
        <div className="w-full h-full flex flex-col items-center justify-center gap-5">
          <div className="w-full xl:h-[150px] mt-3 h-fit flex flex-col xl:flex-row items-center justify-center gap-5">
            <UpdateUsername serverData={pb.authStore.model!.username} />
            <Link
              href="/forgot"
              target="_blank"
              className="w-full px-2 text-center py-2 h-full flex flex-col items-center justify-center bg-palette-background shadow-button border-[4px] border-black"
            >
              <p className="text-[35px] md:text-[40px] text-black font-medium">
                Change <span className="font-bold inline">Password</span>
              </p>
            </Link>
          </div>
          <div className="w-full xl:h-[150px] mt-3 h-fit flex flex-col xl:flex-row items-center justify-center gap-5">
            <DeletePlaylists />
            <DeleteAccount />
          </div>
          <Link
            href="/dashboard/account/icon"
            className="w-full px-2 text-center h-full py-2 flex flex-row gap-5 items-center justify-center bg-palette-background shadow-button border-[4px] border-black"
          >
            <Image
              src="/dicebear-avatar.png"
              width={150}
              height={150}
              alt="Dicebear Icon"
            />{" "}
            <p className="text-[35px] md:text-[40px] text-black font-medium">
              View <span className="font-bold inline">Account Icon</span>
            </p>
          </Link>
        </div>
      </WidthWrapper>
    </div>
  );
}
