import { NextRequest, NextResponse } from "next/server";
import { getPlanetBatch } from "../../../lib/archive";

export const revalidate = 60;

export async function GET(request: NextRequest) {
  try {
    const cursor = request.nextUrl.searchParams.get("cursor") ?? undefined;
    return NextResponse.json(await getPlanetBatch(cursor), {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Exoplanet records could not be loaded." },
      { status: 502 },
    );
  }
}
