import { updateBookmark } from '~/app/_common/actions/bookmark.action';
import { type Bookmark } from '~/app/_common/interfaces/bookmark.interface';
import { getMetadata } from './get-metadata.action';

export async function fixBrokenFavicon({ id, url }: Pick<Bookmark, 'id' | 'url'>) {
  try {
    const metadata = await getMetadata(url, true);
    await updateBookmark({
      id,
      faviconUrl: metadata.logo,
      url: metadata.url,
      title: metadata.title,
      description: metadata.description,
    });
    return { success: true, id };
  } catch (error) {
    console.error(`Error fixing favicon for bookmark ${id}:`, error);
    return { success: false, error: String(error) };
  }
}
