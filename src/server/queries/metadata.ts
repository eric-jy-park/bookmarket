import "server-only";
import urlMetadata from "url-metadata";

export const getMetadata = async (url: string) => {
  const response = await urlMetadata(url);
  return response;
};
