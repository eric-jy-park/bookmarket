import { useMutation } from "@tanstack/react-query";
import { metadataService } from "../../services/metadata-service";
import { useQueryClient } from "@tanstack/react-query";
import { bookmarksQueries } from "../queries/bookmark-query";

export const useUrlMetadataMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (url: string) => metadataService.getMetadata(url),
    onSuccess: async () => {
      await queryClient.invalidateQueries(bookmarksQueries.bookmarks());
    },
  });
};
