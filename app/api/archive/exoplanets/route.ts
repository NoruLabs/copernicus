import { NextRequest, NextResponse } from "next/server";
import { getPlanetBatch } from "../../../lib/archive";

export async function GET(request: NextRequest) {
  try {
    const cursor = request.nextUrl.searchParams.get("cursor") ?? undefined;
    return NextResponse.json(await getPlanetBatch(cursor));
  } catch {
    return NextResponse.json(
      { error: "Exoplanet records could not be loaded." },
      { status: 502 },
    );
  }
}
