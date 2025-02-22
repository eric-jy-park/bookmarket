import { useMutation } from "@tanstack/react-query";
import { metadataService } from "../../services/metadata-service";
import { bookmarksQueries } from "../queries/bookmark-query";
import { getQueryClient } from "~/app/_core/utils/get-query-client";

export const useUrlMetadataMutation = () => {
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: (url: string) => metadataService.getMetadata(url),
    onSuccess: async () => {
      await queryClient.invalidateQueries(bookmarksQueries.bookmarks());
    },
  });
};
