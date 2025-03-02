import { NextResponse } from "next/server";
import { getMetadata } from "~/app/(pages)/(home)/_actions/get-metadata.action";

export async function POST(req: Request) {
  const { url }: { url: string } = await req.json();

  const metadata = await getMetadata(url);

  return NextResponse.json(metadata);
}
