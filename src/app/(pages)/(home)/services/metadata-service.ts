import ky from "ky";
import { type UrlMetadata } from "~/types/metadata";

class MetadataService {
  async getMetadata(url: string): Promise<UrlMetadata> {
    return ky.post(`/api/metadata`, { json: { url } }).json();
  }
}

export const metadataService = new MetadataService();
