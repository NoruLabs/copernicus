import { NextRequest, NextResponse } from "next/server";
import { getNeoBatch } from "../../../lib/archive";

export const revalidate = 60;

export async function GET(request: NextRequest) {
  try {
    const cursor = request.nextUrl.searchParams.get("cursor") ?? undefined;
    return NextResponse.json(await getNeoBatch(cursor), {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Near-Earth records could not be loaded." },
      { status: 502 },
    );
  }
}
