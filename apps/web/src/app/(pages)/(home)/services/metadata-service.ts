import { type UrlMetadata } from "~/types/metadata";
import { getMetadata as getMetadataAction } from "../_actions/get-metadata.action";

class MetadataService {
  async getMetadata(url: string): Promise<UrlMetadata> {
    return await getMetadataAction(url);
  }
}

export const metadataService = new MetadataService();
