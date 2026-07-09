import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Try POST search — returns 50 most recently updated projects, sorted server-side
    try {
      const res = await fetch("https://techport.nasa.gov/api/projects/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ limit: 50, sortString: "lastUpdated desc" }),
      });
      if (res.ok) {
        const data = await res.json();
        const projects = data.results ?? data;
        if (Array.isArray(projects)) {
          return NextResponse.json(projects.slice(0, 30));
        }
      }
    } catch {
      // POST failed, fall through
    }

    // Fallback: get IDs of projects updated this year (compact response)
    const idRes = await fetch("https://techport.nasa.gov/api/projects?updatedSince=2026-01-01");
    if (!idRes.ok) throw new Error(`Failed to get project IDs: ${idRes.statusText}`);
    const ids: number[] = await idRes.json();

    // Take the last 20 (highest IDs tend to be newer projects)
    const recentIds = ids.slice(-20).reverse();

    const projects = (await Promise.allSettled(
      recentIds.map(async (id) => {
        const detailRes = await fetch(`https://techport.nasa.gov/api/projects/${id}`);
        if (!detailRes.ok) return null;
        const data = await detailRes.json();
        return data.project ?? null;
      })
    ))
      .filter((r) => r.status === "fulfilled" && r.value)
      .map((r) => (r as PromiseFulfilledResult<any>).value);

    // Sort by lastUpdated descending
    projects.sort((a: any, b: any) => {
      const da = new Date(a.lastUpdated || "2000-01-01").getTime();
      const db = new Date(b.lastUpdated || "2000-01-01").getTime();
      return db - da;
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("TechPort fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
