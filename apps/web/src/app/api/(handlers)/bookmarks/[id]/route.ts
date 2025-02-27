import { NextResponse } from "next/server";
import { updateBookmark } from "~/server/queries/bookmark";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { title, description, faviconUrl, url } = await req.json();
  const id = +params.id;

  const bookmark = await updateBookmark({
    id,
    title,
    description,
    faviconUrl,
    url,
  });

  return NextResponse.json(bookmark);
}
