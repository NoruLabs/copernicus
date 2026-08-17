import { NextRequest, NextResponse } from "next/server";
import { getImageBatch, getImageById } from "../../../lib/archive";

export async function GET(request: NextRequest) {
  try {
    const item = request.nextUrl.searchParams.get("item");
    if (item) {
      const image = await getImageById(item);
      return image
        ? NextResponse.json(image)
        : NextResponse.json(
            { error: "NASA image record was not found." },
            { status: 404 },
          );
    }
    const cursor = request.nextUrl.searchParams.get("cursor") ?? undefined;
    return NextResponse.json(await getImageBatch(cursor));
  } catch {
    return NextResponse.json(
      { error: "NASA image records could not be loaded." },
      { status: 502 },
    );
  }
}
