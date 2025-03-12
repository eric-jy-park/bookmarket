"use server";
import ky from "ky";
import * as Sentry from "@sentry/nextjs";

const options = {
  timeout: 30000,
  retry: 2,
  prefixUrl: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    credentials: "include",
  },
  onError: (e: any) => {
    Sentry.captureException(JSON.stringify(e));
  }
};

export const http = ky.create({
  ...options,
});
