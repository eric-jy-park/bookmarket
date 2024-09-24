import { NextResponse } from "next/server";
import { getMetadata } from "~/server/queries/metadata";

export async function POST(req: Request) {
  const { url }: { url: string } = await req.json();
  const response = await getMetadata(url);
  return NextResponse.json(response);
}
