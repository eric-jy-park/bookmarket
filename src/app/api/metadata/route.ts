import { NextResponse } from "next/server";
import urlMetadata from "url-metadata";

export async function POST(req: Request) {
  const { url }: { url: string } = await req.json();
  const response = await urlMetadata(url);
  return NextResponse.json(response);
}
