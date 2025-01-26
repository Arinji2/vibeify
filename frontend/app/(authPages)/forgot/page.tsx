export const dynamic = "force-dynamic";
import Link from "next/link";
import { Form } from "./form";
export default function Page() {
  return (
    <div className="flex min-h-excludeMobNav w-full flex-col items-center justify-center gap-5 bg-palette-background pb-5 md:min-h-excludeNav">
      <h1 className="pt-5 text-[50px] font-bold text-black md:pt-0 md:text-[70px]">
        FORGOT PASSWORD
      </h1>

      <h2 className="text-center text-[20px] font-medium text-black">
        Please enter your email to reset password
      </h2>
      <Form />
      <Link
        href="/login"
        className="text-xl font-medium text-black border-b-4 border-black mt-3"
      >
        Back to Login
      </Link>
    </div>
  );
}
