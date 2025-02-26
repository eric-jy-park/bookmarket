import { getMetadata } from "./get-metadata.action";
import { http } from "~/app/_common/utils/http";

export async function fixBrokenFavicon(id: number, url: string) {
  const metadata = await getMetadata(url);
  const faviconUrl = metadata.logo;
  await http.patch(`/api/bookmarks/${id}`, {
    json: {
      faviconUrl,
    },
  });
}
