"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function useToast({
  status,
  message,
  successMessage,
  successRoute,
}: {
  status: number;
  message: string;
  successMessage?: string;
  successRoute?: string;
}) {
  const router = useRouter();
  useEffect(() => {
    if (status === 0) return;
    if (status === 200) toast.success(message);
    if (status === 400) toast.error(message);

    if (successMessage && successRoute)
      if (message === successMessage) router.push(successRoute);

    return () => {
      toast.dismiss();
    };
  }, [message, status, router, successMessage, successRoute]);
}
