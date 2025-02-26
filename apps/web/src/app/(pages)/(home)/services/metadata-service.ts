import { http } from "~/app/_common/utils/http";
import { type UrlMetadata } from "~/types/metadata";

class MetadataService {
  async getMetadata(url: string): Promise<UrlMetadata> {
    return http.post(`/api/metadata`, { json: { url } }).json();
  }
}

export const metadataService = new MetadataService();
