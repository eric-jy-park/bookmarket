import {
  dehydrate,
  HydrationBoundary,
  type UseQueryOptions,
} from "@tanstack/react-query";
import React from "react";
import { getQueryClient } from "~/app/_core/utils/get-query-client";

export const ServerPrefetcher = async ({
  children,
  query,
}: {
  children: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: UseQueryOptions<any, any, any, any>;
}) => {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(query);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
};
