import { getMetadata } from "./get-metadata.action";
import ky from "ky";

export async function fixBrokenFavicon(id: number, url: string) {
  const metadata = await getMetadata(url);
  const faviconUrl = metadata.logo;
  await ky.patch(`/api/bookmarks/${id}`, {
    json: {
      faviconUrl,
    },
  });
}
