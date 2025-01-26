import { cookies } from "next/headers";
import Navbar from "../(navbar)/navbar";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hasCookie = cookies().has("pb_auth");
  return (
    <main className="flex bg-palette-background  flex-col items-center justify-start w-full">
      <Navbar hasCookie={hasCookie} />
      {children}
    </main>
  );
}
