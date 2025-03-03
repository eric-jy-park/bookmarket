import { useMutation } from "@tanstack/react-query";
import { metadataService } from "../../services/metadata-service";
import { bookmarksQueries } from "../queries/bookmark-query";

export const useUrlMetadataMutation = () => {
  return useMutation({
    mutationFn: (url: string) => metadataService.getMetadata(url),
  });
};
