import { NextRequest, NextResponse } from "next/server";
import { getImageBatch } from "../../../lib/archive";

export async function GET(request: NextRequest) {
  try {
    const cursor = request.nextUrl.searchParams.get("cursor") ?? undefined;
    return NextResponse.json(await getImageBatch(cursor));
  } catch {
    return NextResponse.json(
      { error: "NASA image records could not be loaded." },
      { status: 502 },
    );
  }
}
