import { NextResponse } from "next/server";
import {
  createBookmark,
  deleteBookmark,
  getBookmarks,
  updateBookmark,
} from "~/server/queries/bookmark";

export async function GET() {
  const bookmarks = await getBookmarks();

  return NextResponse.json(bookmarks);
}

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

export async function PATCH(req: Request) {
  const { id, title, description, faviconUrl, url } = await req.json();

  const bookmark = await updateBookmark({
    id,
    title,
    description,
    faviconUrl,
    url,
  });

  return NextResponse.json(bookmark);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();

  await deleteBookmark({ id });

  return NextResponse.json({ success: true });
}
