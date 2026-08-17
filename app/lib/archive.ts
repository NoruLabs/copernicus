import "server-only";

const NASA_API_KEY = process.env.NASA_API_KEY || "DEMO_KEY";
const EXOPLANET_API =
  "https://exoplanetarchive.ipac.caltech.edu/TAP/sync";

export type ApodRecord = {
  title: string;
  date: string;
  explanation: string;
  url: string;
  downloadUrl: string;
  mediaType: "image" | "video" | "other";
  copyright: string | null;
};

export type NeoRecord = {
  id: string;
  name: string;
  absoluteMagnitude: number | null;
  hazardous: boolean;
  estimatedDiameterMinKm: number | null;
  estimatedDiameterMaxKm: number | null;
  approachDate: string;
  approachDateFull: string | null;
  velocityKms: number | null;
  missDistanceKm: number | null;
  orbitingBody: string | null;
  nasaUrl: string | null;
};

export type PlanetRecord = {
  name: string;
  host: string;
  discoveryYear: number;
  discoveryDate: string | null;
  discoveryMethod: string | null;
  radiusEarth: number | null;
  massEarth: number | null;
  temperatureK: number | null;
  distancePc: number | null;
  orbitalPeriodDays: number | null;
};

export type ImageRecord = {
  id: string;
  title: string;
  date: string | null;
  description: string | null;
  center: string | null;
  keywords: string[];
  thumbnailUrl: string;
};

export type Batch<T> = {
  items: T[];
  nextCursor: string | null;
};

async function fetchJson(url: string) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Source returned HTTP ${response.status}`);
  }
  return response.json();
}

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function shiftDate(value: string, days: number) {
  const date = new Date(`${value}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return isoDate(date);
}

export async function getApod(date?: string): Promise<ApodRecord> {
  const params = new URLSearchParams({ api_key: NASA_API_KEY });
  if (date) params.set("date", date);
  const data = await fetchJson(
    `https://api.nasa.gov/planetary/apod?${params}`,
  );

  return {
    title: String(data.title ?? "Astronomy picture of the day"),
    date: String(data.date ?? date ?? isoDate(new Date())),
    explanation: String(data.explanation ?? ""),
    url: String(data.url ?? ""),
    downloadUrl: String(data.hdurl ?? data.url ?? ""),
    mediaType:
      data.media_type === "image" || data.media_type === "video"
        ? data.media_type
        : "other",
    copyright: data.copyright ? String(data.copyright) : null,
  };
}

export async function getNeoBatch(cursor?: string): Promise<Batch<NeoRecord>> {
  const [cursorDate, rawOffset] = (cursor ?? `${isoDate(new Date())}:0`).split(":");
  const offset = Math.max(0, Number(rawOffset) || 0);
  const startDate = shiftDate(cursorDate, -6);
  const params = new URLSearchParams({
    start_date: startDate,
    end_date: cursorDate,
    api_key: NASA_API_KEY,
  });
  const data = await fetchJson(
    `https://api.nasa.gov/neo/rest/v1/feed?${params}`,
  );
  const records: NeoRecord[] = [];

  for (const [date, objects] of Object.entries(
    data.near_earth_objects ?? {},
  )) {
    for (const object of objects as Array<Record<string, unknown>>) {
      const approaches = object.close_approach_data as
        | Array<Record<string, unknown>>
        | undefined;
      const approach = approaches?.[0];
      const velocity = approach?.relative_velocity as
        | Record<string, string>
        | undefined;
      const distance = approach?.miss_distance as
        | Record<string, string>
        | undefined;
      const diameter = object.estimated_diameter as
        | { kilometers?: { estimated_diameter_min?: number; estimated_diameter_max?: number } }
        | undefined;

      records.push({
        id: String(object.id ?? ""),
        name: String(object.name ?? "Unnamed object"),
        absoluteMagnitude:
          typeof object.absolute_magnitude_h === "number"
            ? object.absolute_magnitude_h
            : null,
        hazardous: Boolean(object.is_potentially_hazardous_asteroid),
        estimatedDiameterMinKm:
          diameter?.kilometers?.estimated_diameter_min ?? null,
        estimatedDiameterMaxKm:
          diameter?.kilometers?.estimated_diameter_max ?? null,
        approachDate: String(approach?.close_approach_date ?? date),
        approachDateFull: approach?.close_approach_date_full
          ? String(approach.close_approach_date_full)
          : null,
        velocityKms: Number.isFinite(Number(velocity?.kilometers_per_second))
          ? Number(velocity?.kilometers_per_second)
          : null,
        missDistanceKm: Number.isFinite(Number(distance?.kilometers))
          ? Number(distance?.kilometers)
          : null,
        orbitingBody: approach?.orbiting_body
          ? String(approach.orbiting_body)
          : null,
        nasaUrl: object.nasa_jpl_url ? String(object.nasa_jpl_url) : null,
      });
    }
  }

  records.sort((a, b) => {
    const dateOrder = b.approachDate.localeCompare(a.approachDate);
    return dateOrder || a.name.localeCompare(b.name);
  });

  const items = records.slice(offset, offset + 20);
  const nextCursor =
    offset + 20 < records.length
      ? `${cursorDate}:${offset + 20}`
      : `${shiftDate(startDate, -1)}:0`;

  return { items, nextCursor };
}

export async function getNeoById(id: string): Promise<NeoRecord | null> {
  if (!/^\d+$/.test(id)) return null;
  const data = await fetchJson(
    `https://api.nasa.gov/neo/rest/v1/neo/${id}?api_key=${encodeURIComponent(NASA_API_KEY)}`,
  );
  const approaches = Array.isArray(data?.close_approach_data)
    ? data.close_approach_data
    : [];
  const now = Date.now();
  const approach = approaches
    .filter((item: Record<string, unknown>) => item.close_approach_date)
    .sort((a: Record<string, unknown>, b: Record<string, unknown>) => {
      const aDistance = Math.abs(
        new Date(`${String(a.close_approach_date)}T12:00:00Z`).getTime() - now,
      );
      const bDistance = Math.abs(
        new Date(`${String(b.close_approach_date)}T12:00:00Z`).getTime() - now,
      );
      return aDistance - bDistance;
    })[0] as Record<string, unknown> | undefined;
  if (!approach) return null;
  const velocity = approach.relative_velocity as Record<string, string> | undefined;
  const distance = approach.miss_distance as Record<string, string> | undefined;
  const diameter = data.estimated_diameter?.kilometers;

  return {
    id: String(data.id),
    name: String(data.name ?? "Unnamed object"),
    absoluteMagnitude:
      typeof data.absolute_magnitude_h === "number"
        ? data.absolute_magnitude_h
        : null,
    hazardous: Boolean(data.is_potentially_hazardous_asteroid),
    estimatedDiameterMinKm:
      typeof diameter?.estimated_diameter_min === "number"
        ? diameter.estimated_diameter_min
        : null,
    estimatedDiameterMaxKm:
      typeof diameter?.estimated_diameter_max === "number"
        ? diameter.estimated_diameter_max
        : null,
    approachDate: String(approach.close_approach_date),
    approachDateFull: approach.close_approach_date_full
      ? String(approach.close_approach_date_full)
      : null,
    velocityKms: Number.isFinite(Number(velocity?.kilometers_per_second))
      ? Number(velocity?.kilometers_per_second)
      : null,
    missDistanceKm: Number.isFinite(Number(distance?.kilometers))
      ? Number(distance?.kilometers)
      : null,
    orbitingBody: approach.orbiting_body
      ? String(approach.orbiting_body)
      : null,
    nasaUrl: data.nasa_jpl_url ? String(data.nasa_jpl_url) : null,
  };
}

function escapeAdql(value: string) {
  return value.replaceAll("'", "''");
}

export async function getPlanetBatch(
  cursor?: string,
): Promise<Batch<PlanetRecord>> {
  let cursorCondition = "";
  if (cursor) {
    const [date, ...nameParts] = decodeURIComponent(cursor).split("|");
    const name = nameParts.join("|");
    if (/^\d{4}-\d{2}-\d{2}$/.test(date) && name) {
      cursorCondition = ` AND (disc_pubdate < '${date}' OR (disc_pubdate = '${date}' AND pl_name > '${escapeAdql(name)}'))`;
    }
  }
  const query = `SELECT TOP 21 pl_name, hostname, disc_year, disc_pubdate, discoverymethod, pl_rade, pl_bmasse, pl_eqt, sy_dist, pl_orbper FROM pscomppars WHERE disc_year IS NOT NULL AND disc_pubdate IS NOT NULL${cursorCondition} ORDER BY disc_pubdate DESC, pl_name ASC`;
  const data = await fetchJson(
    `${EXOPLANET_API}?query=${encodeURIComponent(query)}&format=json`,
  );
  const rows = Array.isArray(data) ? data : [];
  const items = rows.slice(0, 20).map((row) => ({
    name: String(row.pl_name ?? "Unnamed planet"),
    host: String(row.hostname ?? "Unknown host"),
    discoveryYear: Number(row.disc_year),
    discoveryDate: row.disc_pubdate ? String(row.disc_pubdate).slice(0, 10) : null,
    discoveryMethod: row.discoverymethod
      ? String(row.discoverymethod)
      : null,
    radiusEarth: typeof row.pl_rade === "number" ? row.pl_rade : null,
    massEarth: typeof row.pl_bmasse === "number" ? row.pl_bmasse : null,
    temperatureK: typeof row.pl_eqt === "number" ? row.pl_eqt : null,
    distancePc: typeof row.sy_dist === "number" ? row.sy_dist : null,
    orbitalPeriodDays:
      typeof row.pl_orbper === "number" ? row.pl_orbper : null,
  }));
  const last = items.at(-1);
  return {
    items,
    nextCursor:
      rows.length > 20 && last?.discoveryDate
        ? encodeURIComponent(`${last.discoveryDate}|${last.name}`)
        : null,
  };
}

export async function getImageBatch(
  cursor = `${new Date().getUTCFullYear()}:0:0`,
): Promise<Batch<ImageRecord>> {
  const [rawYear, rawPage, rawOffset] = cursor.split(":");
  const year = Math.min(
    new Date().getUTCFullYear(),
    Math.max(1958, Number(rawYear) || new Date().getUTCFullYear()),
  );
  let page = Math.max(0, Number(rawPage) || 0);
  const offset = Math.max(0, Number(rawOffset) || 0);
  const baseParams = new URLSearchParams({
    q: "",
    media_type: "image",
    year_start: String(year),
    year_end: String(year),
  });
  if (page === 0) {
    const metadata = await fetchJson(
      `https://images-api.nasa.gov/search?${baseParams}&page=1`,
    );
    const totalHits = Number(metadata?.collection?.metadata?.total_hits ?? 0);
    if (totalHits === 0 && year > 1958) {
      return getImageBatch(`${year - 1}:0:0`);
    }
    page = Math.max(1, Math.ceil(totalHits / 100));
  }
  const data = await fetchJson(
    `https://images-api.nasa.gov/search?${baseParams}&page=${page}`,
  );
  const sourceItems = Array.isArray(data?.collection?.items)
    ? data.collection.items
    : [];
  const mapped: ImageRecord[] = sourceItems
    .map((item: Record<string, unknown>) => {
      const info = (item.data as Array<Record<string, unknown>> | undefined)?.[0];
      const links = item.links as Array<Record<string, unknown>> | undefined;
      const preview = links?.find((link) => link.rel === "preview")?.href;
      if (!info?.nasa_id || !info.title || !preview) return null;
      return {
        id: String(info.nasa_id),
        title: String(info.title),
        date: info.date_created ? String(info.date_created) : null,
        description: info.description ? String(info.description) : null,
        center: info.center ? String(info.center) : null,
        keywords: Array.isArray(info.keywords)
          ? info.keywords.map(String).slice(0, 6)
          : [],
        thumbnailUrl: String(preview),
      };
    })
    .filter((item: ImageRecord | null): item is ImageRecord => item !== null)
    .sort((a: ImageRecord, b: ImageRecord) =>
      (b.date ?? "").localeCompare(a.date ?? ""),
    );
  const items = mapped.slice(offset, offset + 20);
  const nextCursor =
    offset + 20 < mapped.length
      ? `${year}:${page}:${offset + 20}`
      : page > 1
        ? `${year}:${page - 1}:0`
        : year > 1958
          ? `${year - 1}:0:0`
          : null;
  return { items, nextCursor };
}

export async function getImageById(id: string): Promise<ImageRecord | null> {
  const params = new URLSearchParams({ nasa_id: id, media_type: "image" });
  const data = await fetchJson(`https://images-api.nasa.gov/search?${params}`);
  const source = data?.collection?.items?.[0] as
    | Record<string, unknown>
    | undefined;
  const info = (source?.data as Array<Record<string, unknown>> | undefined)?.[0];
  const links = source?.links as Array<Record<string, unknown>> | undefined;
  const preview = links?.find((link) => link.rel === "preview")?.href;
  if (!info?.nasa_id || !info.title || !preview) return null;

  return {
    id: String(info.nasa_id),
    title: String(info.title),
    date: info.date_created ? String(info.date_created) : null,
    description: info.description ? String(info.description) : null,
    center: info.center ? String(info.center) : null,
    keywords: Array.isArray(info.keywords)
      ? info.keywords.map(String).slice(0, 6)
      : [],
    thumbnailUrl: String(preview),
  };
}
