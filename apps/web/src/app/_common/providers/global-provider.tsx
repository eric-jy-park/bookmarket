"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";
import { useBodyScrollLock } from "../hooks/use-body-scroll-lock";
import { getQueryClient } from "~/app/_core/utils/get-query-client";
import { GoogleOAuthProvider } from "@react-oauth/google";

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = React.useState(() => getQueryClient());
  useBodyScrollLock();

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
};
