import { NextResponse } from "next/server";
import { createBookmark, getBookmarks } from "~/server/queries/bookmark";

export async function POST(req: Request) {
  const { title, description, faviconUrl, url } = await req.json();

  const bookmark = await createBookmark({
    title,
    description,
    faviconUrl,
    url,
  });

  return NextResponse.json(bookmark);
}

export async function GET() {
  const bookmarks = await getBookmarks();

  return NextResponse.json(bookmarks);
}
