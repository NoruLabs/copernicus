import { PlanetArchive } from "../components/ArchiveLists";
import { PageShell } from "../components/PageShell";
import type { Batch, PlanetRecord } from "../lib/archive";
import { getPlanetBatch } from "../lib/archive";

export const dynamic = "force-dynamic";

export default async function ExoplanetsPage({
  searchParams,
}: {
  searchParams: Promise<{ planet?: string }>;
}) {
  const { planet } = await searchParams;
  const initial = await getPlanetBatch().catch(
    (): Batch<PlanetRecord> => ({ items: [], nextCursor: null }),
  );
  if (planet) {
    initial.items.sort((a, b) =>
      a.name === planet ? -1 : b.name === planet ? 1 : 0,
    );
  }

  return (
    <PageShell title="Exoplanets">
      {initial.items.length > 0 ? (
        <PlanetArchive initial={initial} selected={planet} />
      ) : (
        <p className="empty">
          Exoplanet records could not be loaded. Try this page again shortly.
        </p>
      )}
    </PageShell>
  );
}
