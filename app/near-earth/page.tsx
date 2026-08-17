import { NeoArchive } from "../components/ArchiveLists";
import { PageShell } from "../components/PageShell";
import type { Batch, NeoRecord } from "../lib/archive";
import { getNeoBatch, getNeoById } from "../lib/archive";

export const dynamic = "force-dynamic";

export default async function NearEarthPage({
  searchParams,
}: {
  searchParams: Promise<{ object?: string }>;
}) {
  const { object } = await searchParams;
  const [initial, selectedObject] = await Promise.all([
    getNeoBatch().catch(
      (): Batch<NeoRecord> => ({ items: [], nextCursor: null }),
    ),
    object ? getNeoById(object).catch(() => null) : Promise.resolve(null),
  ]);
  if (
    selectedObject &&
    !initial.items.some((item) => item.id === selectedObject.id)
  ) {
    initial.items.unshift(selectedObject);
  } else if (object) {
    initial.items.sort((a, b) =>
      a.id === object ? -1 : b.id === object ? 1 : 0,
    );
  }

  return (
    <PageShell title="Near Earth">
      {initial.items.length > 0 ? (
        <NeoArchive initial={initial} selected={object} />
      ) : (
        <p className="empty">
          Near-Earth records could not be loaded. Try this page again shortly.
        </p>
      )}
    </PageShell>
  );
}
