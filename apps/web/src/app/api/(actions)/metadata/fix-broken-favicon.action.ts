import { http } from "~/app/_common/utils/http";
import { getMetadata } from "./get-metadata.action";

export async function fixBrokenFavicon(id: number, url: string) {
  const metadata = await getMetadata(url);
  const faviconUrl = metadata.logo;
  await http.patch(`/api/bookmarks/${id}`, {
    json: {
      faviconUrl,
    },
  });
}
