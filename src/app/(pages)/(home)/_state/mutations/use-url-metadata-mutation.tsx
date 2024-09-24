import { useMutation } from "@tanstack/react-query";
import ky from "ky";

export const useUrlMetadataMutation = () => {
  return useMutation({
    mutationFn: async (url: string) => {
      const response = await ky
        .post("/api/getMetadata", {
          json: { url },
        })
        .json();
      return response;
    },
  });
};
