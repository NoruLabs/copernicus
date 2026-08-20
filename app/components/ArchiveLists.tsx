"use client";

import { ExternalLink, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  Batch,
  ImageRecord,
  NeoRecord,
  PlanetRecord,
} from "../lib/archive";
import {
  NeoIllustration,
  NeoIllustrationRoot,
  PlanetIllustration,
  PlanetIllustrationRoot,
} from "./object-stage";

function number(value: number | null, digits = 2) {
  return value == null
    ? "Not available"
    : new Intl.NumberFormat("en", { maximumFractionDigits: digits }).format(value);
}

function LoadMore({
  busy,
  cursor,
  onLoad,
}: {
  busy: boolean;
  cursor: string | null;
  onLoad: () => void;
}) {
  if (!cursor) return <p className="archive-end">You have reached the end of this archive.</p>;
  return (
    <div className="load-more-row">
      <button className="load-more" disabled={busy} onClick={onLoad} type="button">
        {busy ? "Loading…" : "Load 20 more"}
      </button>
    </div>
  );
}

export function NeoArchive({
  initial,
  selected,
}: {
  initial: Batch<NeoRecord>;
  selected?: string;
}) {
  const [items, setItems] = useState(initial.items);
  const [cursor, setCursor] = useState(initial.nextCursor);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  async function load() {
    if (!cursor || busy) return;
    setBusy(true);
    setError(false);
    try {
      const response = await fetch(
        `/api/archive/near-earth?cursor=${encodeURIComponent(cursor)}`,
        { cache: "no-store" },
      );
      if (!response.ok) throw new Error();
      const batch = (await response.json()) as Batch<NeoRecord>;
      setItems((current) => [...current, ...batch.items]);
      setCursor(batch.nextCursor);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <NeoIllustrationRoot>
      <div className="archive-list">
        {items.map((item) => (
          <article
            className="archive-record neo-record"
            data-selected={selected === item.id || undefined}
            id={`object-${item.id}`}
            key={`${item.id}-${item.approachDateFull ?? item.approachDate}`}
          >
            <NeoIllustration item={item} />
            <div className="record-heading">
              <div>
                <h2>{item.name}</h2>
                <p className="meta">
                  Approach {item.approachDateFull ?? item.approachDate}
                </p>
              </div>
              <span className={item.hazardous ? "status-flag" : "status-quiet"}>
                {item.hazardous ? "Potentially hazardous" : "No hazard flag"}
              </span>
            </div>
            <dl className="data-grid">
              <div><dt>Miss distance</dt><dd>{number(item.missDistanceKm, 0)} km</dd></div>
              <div><dt>Velocity</dt><dd>{number(item.velocityKms)} km/s</dd></div>
              <div><dt>Estimated diameter</dt><dd>{number(item.estimatedDiameterMinKm)} to {number(item.estimatedDiameterMaxKm)} km</dd></div>
              <div><dt>Absolute magnitude</dt><dd>{number(item.absoluteMagnitude)}</dd></div>
              <div><dt>Orbit class</dt><dd>{item.orbitClass ?? "Not available"}</dd></div>
              <div><dt>NASA reference</dt><dd>{item.id}</dd></div>
            </dl>
            {item.nasaUrl ? <a className="source-link" href={item.nasaUrl}>Open NASA JPL record</a> : null}
          </article>
        ))}
      </div>
      {error ? <p className="load-error">More records could not be loaded. Try again.</p> : null}
      <LoadMore busy={busy} cursor={cursor} onLoad={load} />
    </NeoIllustrationRoot>
  );
}

export function PlanetArchive({
  initial,
  selected,
}: {
  initial: Batch<PlanetRecord>;
  selected?: string;
}) {
  const [items, setItems] = useState(initial.items);
  const [cursor, setCursor] = useState(initial.nextCursor);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  async function load() {
    if (!cursor || busy) return;
    setBusy(true);
    setError(false);
    try {
      const response = await fetch(
        `/api/archive/exoplanets?cursor=${encodeURIComponent(cursor)}`,
        { cache: "no-store" },
      );
      if (!response.ok) throw new Error();
      const batch = (await response.json()) as Batch<PlanetRecord>;
      setItems((current) => [...current, ...batch.items]);
      setCursor(batch.nextCursor);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <PlanetIllustrationRoot>
      <div className="archive-list">
        {items.map((item) => (
          <article
            className="archive-record"
            data-selected={selected === item.name || undefined}
            id={`planet-${encodeURIComponent(item.name)}`}
            key={`${item.name}-${item.host}`}
          >
            <PlanetIllustration item={item} />
            <div className="record-heading">
              <div>
                <h2>{item.name}</h2>
                <p className="meta">Orbits {item.host}</p>
              </div>
              <p className="record-year">
                {item.discoveryDate ?? item.discoveryYear}
              </p>
            </div>
            <dl className="data-grid">
              <div><dt>Discovery method</dt><dd>{item.discoveryMethod ?? "Not available"}</dd></div>
              <div><dt>Radius</dt><dd>{number(item.radiusEarth)} Earths</dd></div>
              <div><dt>Mass</dt><dd>{number(item.massEarth)} Earths</dd></div>
              <div><dt>Equilibrium temperature</dt><dd>{number(item.temperatureK, 0)} K</dd></div>
              <div><dt>Distance</dt><dd>{number(item.distancePc)} parsecs</dd></div>
              <div><dt>Orbital period</dt><dd>{number(item.orbitalPeriodDays)} days</dd></div>
            </dl>
            {item.discoveryUrl ? (
              <a
                className="source-link"
                href={item.discoveryUrl}
                rel="noreferrer"
                target="_blank"
              >
                {item.discoveryLabel
                  ? `Open discovery: ${item.discoveryLabel}`
                  : "Open discovery paper"}
              </a>
            ) : null}
          </article>
        ))}
      </div>
      {error ? <p className="load-error">More records could not be loaded. Try again.</p> : null}
      <LoadMore busy={busy} cursor={cursor} onLoad={load} />
    </PlanetIllustrationRoot>
  );
}

export function ImageArchive({
  initial,
  selected,
}: {
  initial: Batch<ImageRecord>;
  selected?: string;
}) {
  const [items, setItems] = useState(initial.items);
  const [cursor, setCursor] = useState(initial.nextCursor);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(selected ?? null);
  const [detailStatus, setDetailStatus] = useState<
    "idle" | "loading" | "error"
  >("idle");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const activeImage = useMemo(
    () => items.find((item) => item.id === activeId) ?? null,
    [activeId, items],
  );

  const load = useCallback(async () => {
    if (!cursor || busy) return;
    setBusy(true);
    setError(false);
    try {
      const response = await fetch(
        `/api/archive/images?cursor=${encodeURIComponent(cursor)}`,
        { cache: "no-store" },
      );
      if (!response.ok) throw new Error();
      const batch = (await response.json()) as Batch<ImageRecord>;
      setItems((current) => {
        const known = new Set(current.map((item) => item.id));
        return [
          ...current,
          ...batch.items.filter((item) => !known.has(item.id)),
        ];
      });
      setCursor(batch.nextCursor);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }, [busy, cursor]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !cursor || error) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void load();
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [cursor, error, load]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (activeImage && !dialog.open) dialog.showModal();
    if (!activeImage && dialog.open) dialog.close();
  }, [activeImage]);

  function closeDetail() {
    setActiveId(null);
    setDetailStatus("idle");
  }

  async function openDetail(item: ImageRecord) {
    setActiveId(item.id);
    if (item.description !== null || item.keywords.length > 0) return;

    setDetailStatus("loading");
    try {
      const response = await fetch(
        `/api/archive/images?item=${encodeURIComponent(item.id)}`,
        { cache: "force-cache" },
      );
      if (!response.ok) throw new Error();
      const detail = (await response.json()) as ImageRecord;
      setItems((current) =>
        current.map((record) => (record.id === detail.id ? detail : record)),
      );
      setDetailStatus("idle");
    } catch {
      setDetailStatus("error");
    }
  }

  return (
    <div className="image-archive">
      <div className="masonry">
        {items.map((item) => (
          <article
            className="image-tile"
            data-selected={selected === item.id || undefined}
            id={`image-${item.id}`}
            key={item.id}
          >
            <button
              aria-label={`View details for ${item.title}`}
              className="image-open"
              onClick={() => void openDetail(item)}
              type="button"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.thumbnailUrl} alt={item.title} loading="lazy" />
            </button>
            <div className="image-tile-copy">
              <div>
                <h2>{item.title}</h2>
                <p className="meta">
                  {item.date
                    ? new Date(item.date).toLocaleDateString("en", {
                        dateStyle: "medium",
                      })
                    : "Date unavailable"}
                  {item.center ? ` · ${item.center}` : ""}
                </p>
              </div>
              <a
                aria-label={`Open ${item.title} on NASA Images`}
                className="image-source-icon"
                href={`https://images.nasa.gov/details/${encodeURIComponent(item.id)}`}
                rel="noreferrer"
                target="_blank"
                title="Open on NASA Images"
              >
                <ExternalLink aria-hidden="true" />
              </a>
            </div>
          </article>
        ))}
      </div>
      {error ? <p className="load-error">More images could not be loaded. Try again.</p> : null}
      {error ? (
        <div className="load-more-row">
          <button className="load-more" onClick={() => void load()} type="button">
            Try again
          </button>
        </div>
      ) : null}
      <div className="infinite-sentinel" ref={sentinelRef}>
        {busy ? (
          <p role="status">Loading more images</p>
        ) : cursor ? (
          <p>Scroll for more</p>
        ) : (
          <p>You have reached the end of this archive.</p>
        )}
      </div>

      <dialog
        aria-labelledby={activeImage ? `image-detail-${activeImage.id}` : undefined}
        className="image-detail-dialog"
        onCancel={(event) => {
          event.preventDefault();
          closeDetail();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeDetail();
        }}
        ref={dialogRef}
      >
        {activeImage ? (
          <article className="image-detail">
            <button
              aria-label="Close image details"
              className="image-detail-close"
              onClick={closeDetail}
              type="button"
            >
              <X aria-hidden="true" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={activeImage.thumbnailUrl} alt={activeImage.title} />
            <div className="image-detail-copy">
              <div className="image-detail-heading">
                <div>
                  <h2 id={`image-detail-${activeImage.id}`}>
                    {activeImage.title}
                  </h2>
                  <p className="meta">
                    {activeImage.date
                      ? new Date(activeImage.date).toLocaleDateString("en", {
                          dateStyle: "long",
                        })
                      : "Date unavailable"}
                    {activeImage.center ? ` · ${activeImage.center}` : ""}
                  </p>
                </div>
                <a
                  aria-label={`Open ${activeImage.title} on NASA Images`}
                  className="image-source-icon"
                  href={`https://images.nasa.gov/details/${encodeURIComponent(activeImage.id)}`}
                  rel="noreferrer"
                  target="_blank"
                  title="Open on NASA Images"
                >
                  <ExternalLink aria-hidden="true" />
                </a>
              </div>
              {activeImage.description ? (
                <p className="image-detail-description">
                  {activeImage.description}
                </p>
              ) : detailStatus === "loading" ? (
                <p className="image-detail-description" role="status">
                  Loading details
                </p>
              ) : detailStatus === "error" ? (
                <p className="image-detail-description">
                  More details could not be loaded.
                </p>
              ) : null}
              {activeImage.keywords.length > 0 ? (
                <p className="image-keywords">
                  {activeImage.keywords.join(" · ")}
                </p>
              ) : null}
            </div>
          </article>
        ) : null}
      </dialog>
    </div>
  );
}
