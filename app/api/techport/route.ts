import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const response = await fetch("https://techport.nasa.gov/api/projects/search", {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      // NASA endpoint temporarily unavailable — return empty so client keeps retrying
      return NextResponse.json([]);
    }

    const data = await response.json();
    const projects = data.results || [];

    projects.sort((a: any, b: any) => {
      const dateA = new Date(a.endDate || "2000-01-01").getTime();
      const dateB = new Date(b.endDate || "2000-01-01").getTime();
      return dateB - dateA;
    });

    const topProjects = projects.slice(0, 150);

    const detailedProjects = [];
    const chunkSize = 25;
    for (let i = 0; i < topProjects.length; i += chunkSize) {
      const chunk = topProjects.slice(i, i + chunkSize);
      const detailedChunk = await Promise.all(chunk.map(async (p: any) => {
        const id = p.projectId || p.id;
        try {
          const detailRes = await fetch(`https://techport.nasa.gov/api/projects/${id}`, {
            next: { revalidate: 3600 },
          });
          if (detailRes.ok) {
            const detailData = await detailRes.json();
            const proj = detailData.project || {};

            const imageItem = proj.libraryItems?.find((i: any) => i.libraryItemType === 'Image' || i.file?.fileExtension?.match(/jpg|jpeg|png/i));
            let imageUrl = null;
            if (imageItem && imageItem.file?.fileId) {
              imageUrl = `https://techport.nasa.gov/api/file/${imageItem.file.fileId}`;
            }

            const principalInvestigators = proj.projectContacts
              ?.filter((c: any) => c.projectContactRole === 'Principal_Investigator' || c.projectContactRolePretty === 'Principal Investigator')
              .map((c: any) => c.fullName) || [];

            return {
              ...p,
              imageUrl,
              principalInvestigators,
              benefits: proj.benefits || '',
              trlBegin: proj.trlBegin || p.trlBegin,
              trlCurrent: proj.trlCurrent,
              trlEnd: proj.trlEnd || p.trlEnd,
              leadOrganization: proj.leadOrganization || p.leadOrganization,
              statusDescription: proj.statusDescription || p.statusDescription || p.status,
              description: proj.description || p.description,
            };
          }
        } catch (err) {
          console.error(`Failed to fetch detail for project ${id}`, err);
        }
        return p;
      }));
      detailedProjects.push(...detailedChunk);
    }

    return NextResponse.json(detailedProjects);
  } catch (error) {
    console.error("TechPort fetch error:", error);
    // Never surface an error to the client — return empty and let the hook retry
    return NextResponse.json([]);
  }
}
