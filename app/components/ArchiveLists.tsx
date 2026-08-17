"use client";

import { useState } from "react";
import type {
  Batch,
  ImageRecord,
  NeoRecord,
  PlanetRecord,
} from "../lib/archive";

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
    <>
      <div className="archive-list">
        {items.map((item) => (
          <article
            className="archive-record neo-record"
            data-selected={selected === item.id || undefined}
            id={`object-${item.id}`}
            key={`${item.id}-${item.approachDateFull ?? item.approachDate}`}
          >
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
              <div><dt>Estimated diameter</dt><dd>{number(item.estimatedDiameterMinKm)}–{number(item.estimatedDiameterMaxKm)} km</dd></div>
              <div><dt>Absolute magnitude</dt><dd>{number(item.absoluteMagnitude)}</dd></div>
              <div><dt>Orbiting body</dt><dd>{item.orbitingBody ?? "Not available"}</dd></div>
              <div><dt>NASA reference</dt><dd>{item.id}</dd></div>
            </dl>
            {item.nasaUrl ? <a className="source-link" href={item.nasaUrl}>Open NASA JPL record</a> : null}
          </article>
        ))}
      </div>
      {error ? <p className="load-error">More records could not be loaded. Try again.</p> : null}
      <LoadMore busy={busy} cursor={cursor} onLoad={load} />
    </>
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
    <>
      <div className="archive-list">
        {items.map((item) => (
          <article
            className="archive-record"
            data-selected={selected === item.name || undefined}
            id={`planet-${encodeURIComponent(item.name)}`}
            key={`${item.name}-${item.host}`}
          >
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
          </article>
        ))}
      </div>
      {error ? <p className="load-error">More records could not be loaded. Try again.</p> : null}
      <LoadMore busy={busy} cursor={cursor} onLoad={load} />
    </>
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

  async function load() {
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
      setItems((current) => [...current, ...batch.items]);
      setCursor(batch.nextCursor);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="masonry">
        {items.map((item) => (
          <article
            className="image-tile"
            data-selected={selected === item.id || undefined}
            id={`image-${item.id}`}
            key={item.id}
          >
            <a href={`/image-library?item=${encodeURIComponent(item.id)}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.thumbnailUrl} alt={item.title} loading="lazy" />
              <h2>{item.title}</h2>
            </a>
            <p className="meta">
              {item.date ? new Date(item.date).toLocaleDateString("en", { dateStyle: "medium" }) : "Date unavailable"}
              {item.center ? ` · ${item.center}` : ""}
            </p>
            {selected === item.id && item.description ? (
              <p className="tile-description">{item.description}</p>
            ) : null}
          </article>
        ))}
      </div>
      {error ? <p className="load-error">More images could not be loaded. Try again.</p> : null}
      <LoadMore busy={busy} cursor={cursor} onLoad={load} />
    </>
  );
}
