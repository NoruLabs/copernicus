import { NextRequest, NextResponse } from "next/server";
import { getApod } from "../../../lib/archive";

export async function GET(request: NextRequest) {
  try {
    const date = request.nextUrl.searchParams.get("date") ?? undefined;
    const apod = await getApod(date);
    if (apod.mediaType !== "image" || !apod.downloadUrl) {
      return NextResponse.json(
        { error: "This APOD is not a downloadable image." },
        { status: 400 },
      );
    }

    const image = await fetch(apod.downloadUrl);
    if (!image.ok || !image.body) throw new Error("Image unavailable");
    const contentType = image.headers.get("content-type") ?? "image/jpeg";
    const extension = contentType.includes("png") ? "png" : "jpg";

    return new NextResponse(image.body, {
      headers: {
        "Content-Disposition": `attachment; filename="apod-${apod.date}.${extension}"`,
        "Content-Type": contentType,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "The APOD download could not be prepared." },
      { status: 502 },
    );
  }
}
