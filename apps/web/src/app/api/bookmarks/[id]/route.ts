import { NextResponse } from "next/server";
import { updateBookmark } from "~/server/queries/bookmark";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { title, description, faviconUrl, url } = await req.json();

  const bookmark = await updateBookmark({
    id,
    title,
    description,
    faviconUrl,
    url,
  });

  return NextResponse.json(bookmark);
}
