import { updateBookmark } from "~/app/_common/actions/bookmark.action";
import { getMetadata } from "./get-metadata.action";
import { type Bookmark } from "~/app/_common/interfaces/bookmark.interface";

export async function fixBrokenFavicon({
  id,
  url,
}: Pick<Bookmark, "id" | "url">) {
  const metadata = await getMetadata(url, true);
  await updateBookmark({
    id,
    faviconUrl: metadata.logo,
    url: metadata.url,
    title: metadata.title,
    description: metadata.description,
  });
}
