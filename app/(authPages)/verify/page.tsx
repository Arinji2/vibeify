export const dynamic = "force-dynamic";
import { getModel } from "@/utils/getModel";
import { SendEmailButton } from "./buttons";
import Pocketbase, { getTokenPayload } from "pocketbase";
export default async function Page({
  searchParams,
}: {
  searchParams: { [token: string]: string | undefined };
}) {
  const model = await getModel();
  const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  let isVerified = "null" as "null" | "true" | "false";
  if (searchParams.token) {
    try {
      await pb.collection("users").confirmVerification(searchParams.token);
      isVerified = "true";
    } catch (e) {
      isVerified = "false";
    }
  }

  return (
    <div className="flex min-h-excludeMobNav w-full flex-col items-center justify-center gap-5 bg-palette-background pb-5 md:min-h-excludeNav">
      <h1 className="pt-5 text-[50px] font-bold text-black md:pt-0 md:text-[70px]">
        VERIFY
      </h1>

      <h2 className="text-center text-[20px] font-medium text-black">
        Verify your email to start using Listify!
      </h2>
      <div className="flex h-fit w-[90%] grow-0 flex-col items-center justify-center gap-2 p-3  md:w-[400px] md:flex-row xl:w-[550px]">
        <div className="h-full w-fit shrink-0">
          {" "}
          <h2 className="text-center text-[20px] font-medium text-black">
            Current Email:
          </h2>
        </div>
        <div className="h-full w-full shrink-0 md:w-[250px]">
          <p className=" truncate text-center text-[20px] font-medium text-palette-primary">
            {model!.email}
          </p>
        </div>
        <div className="h-full w-fit shrink-0">
          <h2 className="border-b-2 border-black text-center text-[20px] font-semibold text-black">
            Not You?
          </h2>
        </div>
      </div>
      <SendEmailButton
        token={searchParams.token!}
        isVerified={isVerified}
        email={model!.email}
      />
    </div>
  );
}
