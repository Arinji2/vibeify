"use client";
import { useRouter } from "next/navigation";
import Pocketbase from "pocketbase";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function ToastListener({
  token,
}: {
  token: string | undefined;
}) {
  const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

  const router = useRouter();

  useEffect(() => {
    if (!token) return;

    pb.collection("users")
      .confirmVerification(token)
      .then(() => {
        toast.success("Email verified!");
        router.push("/login");
      })
      .catch((er) => {
        console.error(er);
        toast.error("Invalid token!");
        router.push("/verify");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, router]);

  return <></>;
}
