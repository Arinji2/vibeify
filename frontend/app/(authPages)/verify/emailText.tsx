"use client";
import * as React from "react";
import { useState, useEffect } from "react";

export default function EmailText({ serverText }: { serverText: string }) {
  const [email, setEmail] = useState(serverText);
  useEffect(() => {
    if (email === "Loading...") {
      const cookieValue = document.cookie
        .split("; ")
        .find((row) => row.startsWith("pb_auth"));
      if (cookieValue) {
        const cookie = cookieValue.split("=")[1];
        const { model } = JSON.parse(cookie);
        setEmail(model.email);
      }
    }
  }, [email]);

  return (
    <p className=" truncate text-left text-[20px] font-medium text-palette-primary">
      {email}
    </p>
  );
}
