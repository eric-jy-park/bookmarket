"use server";
import ky from "ky";
import { refreshToken } from "~/app/(pages)/(auth)/_actions/refresh-token.action";

const options = {
  timeout: 30000,
  retry: 2,
  prefixUrl: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    credentials: "include",
  },
  onError: (error: { status: number }) => {
    if (error.status === 401) {
      void refreshToken();
    }
  },
};

export const http = ky.create({
  ...options,
});
