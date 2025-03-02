import { getMetadata } from "./get-metadata.action";
import { http } from "~/app/_common/utils/http";
import { type Bookmark } from "~/types/bookmark";

export async function fixBrokenFavicon({
  id,
  url,
}: Pick<Bookmark, "id" | "url">) {
  const metadata = await getMetadata(url);
  const faviconUrl = metadata.logo;
  await http.patch(`/api/bookmarks/${id}`, {
    json: {
      faviconUrl,
    },
  });
}
