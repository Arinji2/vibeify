export const dynamic = "force-dynamic";
import { cookies } from "next/headers";
import Link from "next/link";
import Pocketbase from "pocketbase";
import { SendEmailButton } from "./buttons";
import EmailText from "./emailText";
export default async function Page({
  searchParams,
}: {
  searchParams: { [token: string]: string | undefined };
}) {
  const cookie = cookies().get("pb_auth") ?? {
    value: JSON.stringify({ model: { email: "Loading..." } }),
  };
  const { model } = JSON.parse(cookie.value);
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
        Verify your email to start using Vibeify!
      </h2>
      <div className="flex h-fit w-[90%] grow-0 flex-col items-center justify-center gap-2 p-3  md:w-[400px] md:flex-row xl:w-[550px]">
        <div className="h-full w-fit shrink-0">
          {" "}
          <h2 className="text-center text-[20px] font-medium text-black">
            Current Email:
          </h2>
        </div>
        <div className="h-full w-full shrink-0 md:w-[250px]">
          <EmailText serverText={model.email ?? "Loading..."} />
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
      <Link
        href="/login"
        className="text-xl font-medium text-black border-b-4 border-black mt-3"
      >
        Back to Login
      </Link>
    </div>
  );
}
