import { NextRequest, NextResponse } from "next/server";
import { getNeoBatch } from "../../../lib/archive";

export async function GET(request: NextRequest) {
  try {
    const cursor = request.nextUrl.searchParams.get("cursor") ?? undefined;
    return NextResponse.json(await getNeoBatch(cursor));
  } catch {
    return NextResponse.json(
      { error: "Near-Earth records could not be loaded." },
      { status: 502 },
    );
  }
}
