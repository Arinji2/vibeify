export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import Pocketbase, { getTokenPayload } from "pocketbase";
import Form from "./form";
import Link from "next/link";
export default async function Page({
  searchParams,
}: {
  searchParams: { [token: string]: string | undefined };
}) {
  const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

  if (!searchParams.token) redirect("/forgot");
  await pb.admins.authWithPassword(
    process.env.ADMIN_EMAIL!,
    process.env.ADMIN_PASSWORD!
  );

  const payload = getTokenPayload(searchParams.token);
  const data = await pb.collection(payload.collectionId).getOne(payload.id);

  return (
    <div className="flex min-h-excludeMobNav w-full flex-col items-center justify-center gap-5 bg-palette-background pb-5 md:min-h-excludeNav">
      <h1 className="pt-5 text-[50px] text-center font-bold text-black md:pt-0 md:text-[70px]">
        FORGOT PASSWORD
      </h1>

      <div className="flex h-fit w-[90%] grow-0 flex-col items-center justify-center gap-2 p-3  md:w-[400px] md:flex-row xl:w-[550px]">
        <div className="h-full w-fit shrink-0">
          {" "}
          <h2 className="text-center text-[20px] font-medium text-black">
            Current Email:
          </h2>
        </div>
        <div className="h-full w-full shrink-0 md:w-[250px]">
          <p className=" truncate text-center text-[20px] font-medium text-palette-primary">
            {data.email}
          </p>
        </div>
        <div className="h-full w-fit shrink-0">
          <h2 className="border-b-2 border-black text-center text-[20px] font-semibold text-black">
            Not You?
          </h2>
        </div>
      </div>

      <Form token={searchParams.token!} />
      <Link
        href="/login"
        className="text-xl font-medium text-black border-b-4 border-black mt-3"
      >
        Back to Login
      </Link>
    </div>
  );
}
