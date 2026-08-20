import "server-only";
import { unstable_cache } from "next/cache";

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
  orbitClass: string | null;
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

async function fetchJson(url: string, revalidateSeconds = 300) {
  const response = await fetch(url, {
    next: { revalidate: revalidateSeconds },
  });
  if (!response.ok) {
    throw new Error(`Source returned HTTP ${response.status}`);
  }
  return response.json();
}

const ORBIT_CLASS_NAMES: Record<string, string> = {
  APO: "Apollo",
  AMO: "Amor",
  ATE: "Aten",
  ATI: "Atira",
  IEO: "Atira",
};

function formatOrbitClass(data: Record<string, unknown> | null | undefined) {
  const orbitClass = data?.orbital_data as
    | { orbit_class?: { orbit_class_type?: string } }
    | undefined;
  const type = orbitClass?.orbit_class?.orbit_class_type?.trim().toUpperCase();
  if (!type) return null;
  return ORBIT_CLASS_NAMES[type] ?? type;
}

const getNeoOrbitClass = unstable_cache(
  async (id: string): Promise<string | null> => {
    if (!/^\d+$/.test(id)) return null;
    try {
      const data = await fetchJson(
        `https://api.nasa.gov/neo/rest/v1/neo/${id}?api_key=${encodeURIComponent(NASA_API_KEY)}`,
        86_400,
      );
      return formatOrbitClass(data);
    } catch {
      return null;
    }
  },
  ["neo-orbit-class-v1"],
  { revalidate: 86_400 },
);

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
    date ? 86_400 : 60,
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
        orbitClass: null,
        nasaUrl: object.nasa_jpl_url ? String(object.nasa_jpl_url) : null,
      });
    }
  }

  records.sort((a, b) => {
    const dateOrder = b.approachDate.localeCompare(a.approachDate);
    return dateOrder || a.name.localeCompare(b.name);
  });

  const page = records.slice(offset, offset + 20);
  const items = await Promise.all(
    page.map(async (item) => ({
      ...item,
      orbitClass: item.id ? await getNeoOrbitClass(item.id) : null,
    })),
  );
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
    orbitClass: formatOrbitClass(data),
    nasaUrl: data.nasa_jpl_url ? String(data.nasa_jpl_url) : null,
  };
}

export async function getPlanetBatch(
  cursor?: string,
): Promise<Batch<PlanetRecord>> {
  const [rawYear, rawOffset] = (cursor ?? "").split(":");
  let year = Math.min(
    new Date().getUTCFullYear(),
    Math.max(1992, Number(rawYear) || new Date().getUTCFullYear()),
  );
  let offset = Math.max(0, Number(rawOffset) || 0);

  while (year >= 1992) {
    const query = `SELECT pl_name, hostname, disc_year, disc_pubdate, discoverymethod, pl_rade, pl_bmasse, pl_eqt, sy_dist, pl_orbper FROM pscomppars WHERE disc_year = ${year} AND disc_pubdate IS NOT NULL ORDER BY disc_pubdate DESC, pl_name ASC`;
    const data = await fetchJson(
      `${EXOPLANET_API}?query=${encodeURIComponent(query)}&format=json`,
    );
    const rows = Array.isArray(data) ? data : [];
    const records: PlanetRecord[] = rows
      .map((row) => ({
        name: String(row.pl_name ?? "Unnamed planet"),
        host: String(row.hostname ?? "Unknown host"),
        discoveryYear: Number(row.disc_year),
        discoveryDate: row.disc_pubdate
          ? String(row.disc_pubdate).slice(0, 10)
          : null,
        discoveryMethod: row.discoverymethod
          ? String(row.discoverymethod)
          : null,
        radiusEarth: typeof row.pl_rade === "number" ? row.pl_rade : null,
        massEarth: typeof row.pl_bmasse === "number" ? row.pl_bmasse : null,
        temperatureK: typeof row.pl_eqt === "number" ? row.pl_eqt : null,
        distancePc: typeof row.sy_dist === "number" ? row.sy_dist : null,
        orbitalPeriodDays:
          typeof row.pl_orbper === "number" ? row.pl_orbper : null,
      }))
      .sort((a, b) => {
        const dateOrder = (b.discoveryDate ?? "").localeCompare(
          a.discoveryDate ?? "",
        );
        return dateOrder || a.name.localeCompare(b.name);
      });

    if (offset < records.length) {
      const items = records.slice(offset, offset + 20);
      const nextCursor =
        offset + 20 < records.length
          ? `${year}:${offset + 20}`
          : year > 1992
            ? `${year - 1}:0`
            : null;
      return { items, nextCursor };
    }

    year -= 1;
    offset = 0;
  }

  return { items: [], nextCursor: null };
}

function mapImagePreview(
  item: Record<string, unknown>,
): ImageRecord | null {
  const info = (item.data as Array<Record<string, unknown>> | undefined)?.[0];
  const links = item.links as Array<Record<string, unknown>> | undefined;
  const preview = links?.find((link) => link.rel === "preview")?.href;
  if (!info?.nasa_id || !info.title || !preview) return null;

  return {
    id: String(info.nasa_id),
    title: String(info.title),
    date: info.date_created ? String(info.date_created) : null,
    description: null,
    center: info.center ? String(info.center) : null,
    keywords: [],
    thumbnailUrl: String(preview),
  };
}

const getImageYearIndex = unstable_cache(
  async (year: number): Promise<ImageRecord[]> => {
    const baseParams = new URLSearchParams({
      q: "",
      media_type: "image",
      year_start: String(year),
      year_end: String(year),
    });
    const firstPage = await fetchJson(
      `https://images-api.nasa.gov/search?${baseParams}&page=1`,
      1_800,
    );
    const totalHits = Number(
      firstPage?.collection?.metadata?.total_hits ?? 0,
    );
    const pageCount = Math.max(1, Math.ceil(totalHits / 100));
    const remainingPages = await Promise.all(
      Array.from({ length: Math.max(0, pageCount - 1) }, (_, index) =>
        fetchJson(
          `https://images-api.nasa.gov/search?${baseParams}&page=${index + 2}`,
          1_800,
        ),
      ),
    );
    const sourceItems = [firstPage, ...remainingPages].flatMap((data) =>
      Array.isArray(data?.collection?.items) ? data.collection.items : [],
    );
    const unique = new Map<string, ImageRecord>();

    for (const source of sourceItems) {
      const record = mapImagePreview(source as Record<string, unknown>);
      if (record) unique.set(record.id, record);
    }

    return [...unique.values()].sort((a, b) => {
      const dateOrder = (b.date ?? "").localeCompare(a.date ?? "");
      return dateOrder || a.id.localeCompare(b.id);
    });
  },
  ["nasa-image-year-index-v1"],
  { revalidate: 1_800 },
);

export async function getImageBatch(
  cursor = `${new Date().getUTCFullYear()}:0`,
): Promise<Batch<ImageRecord>> {
  const [rawYear, rawOffset] = cursor.split(":");
  let year = Math.min(
    new Date().getUTCFullYear(),
    Math.max(1958, Number(rawYear) || new Date().getUTCFullYear()),
  );
  let offset = Math.max(0, Number(rawOffset) || 0);

  while (year >= 1958) {
    const records = await getImageYearIndex(year);
    if (offset < records.length) {
      const items = records.slice(offset, offset + 20);
      const nextCursor =
        offset + 20 < records.length
          ? `${year}:${offset + 20}`
          : year > 1958
            ? `${year - 1}:0`
            : null;
      return { items, nextCursor };
    }

    year -= 1;
    offset = 0;
  }

  return { items: [], nextCursor: null };
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
