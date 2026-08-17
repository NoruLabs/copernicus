import { ImageArchive } from "../../components/ArchiveLists";
import { PageShell } from "../../components/PageShell";
import type { Batch, ImageRecord } from "../../lib/archive";
import { getImageBatch, getImageById } from "../../lib/archive";

export const revalidate = 300;

export default async function ImageLibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ item?: string }>;
}) {
  const { item } = await searchParams;
  const [initial, selectedImage] = await Promise.all([
    getImageBatch().catch(
      (): Batch<ImageRecord> => ({ items: [], nextCursor: null }),
    ),
    item ? getImageById(item).catch(() => null) : Promise.resolve(null),
  ]);
  if (
    selectedImage &&
    !initial.items.some((image) => image.id === selectedImage.id)
  ) {
    initial.items.unshift(selectedImage);
  }

  return (
    <PageShell title="Image Library">
      {initial.items.length > 0 ? (
        <ImageArchive initial={initial} selected={item} />
      ) : (
        <p className="empty">
          NASA images could not be loaded. Try this page again shortly.
        </p>
      )}
    </PageShell>
  );
}
