import "server-only";

const NASA_API_KEY = process.env.NASA_API_KEY || "DEMO_KEY";

export type EditionApod = {
  title: string;
  date: string;
  explanation: string;
  url: string;
  mediaType: "image" | "video" | "other";
  copyright?: string;
};

export type EditionNeo = {
  count: number;
  hazardous: number;
  closest: {
    id: string;
    name: string;
    distanceKm: number;
    velocityKms: number;
    hazardous: boolean;
  } | null;
};

export type EditionPlanet = {
  name: string;
  host: string;
  year: number | null;
  radiusEarth: number | null;
  distancePc: number | null;
  method: string | null;
};

export type EditionImage = {
  id: string;
  title: string;
  date: string | null;
  thumbnailUrl: string;
  description: string | null;
};

export type DailyEdition = {
  publishedAt: string;
  editionDate: string;
  apod: EditionApod | null;
  neo: EditionNeo | null;
  planets: EditionPlanet[];
  images: EditionImage[];
  errors: string[];
};

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

async function fetchJson(url: string, init?: RequestInit) {
  const response = await fetch(url, {
    ...init,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}

async function loadApod(): Promise<EditionApod> {
  const data = await fetchJson(
    `https://api.nasa.gov/planetary/apod?api_key=${encodeURIComponent(NASA_API_KEY)}`,
  );

  if (!data?.title || !data?.date || !data?.url) {
    throw new Error("APOD payload incomplete");
  }

  return {
    title: data.title,
    date: data.date,
    explanation: data.explanation ?? "",
    url: data.hdurl || data.url,
    mediaType:
      data.media_type === "image" || data.media_type === "video"
        ? data.media_type
        : "other",
    copyright: data.copyright,
  };
}

async function loadNeo(editionDate: string): Promise<EditionNeo> {
  const data = await fetchJson(
    `https://api.nasa.gov/neo/rest/v1/feed?start_date=${editionDate}&end_date=${editionDate}&api_key=${encodeURIComponent(NASA_API_KEY)}`,
  );

  const objects = Object.values(data?.near_earth_objects ?? {}).flat() as Array<{
    id?: string;
    name?: string;
    is_potentially_hazardous_asteroid?: boolean;
    close_approach_data?: Array<{
      miss_distance?: { kilometers?: string };
      relative_velocity?: { kilometers_per_second?: string };
    }>;
  }>;

  let closest: EditionNeo["closest"] = null;

  for (const object of objects) {
    const approach = object.close_approach_data?.[0];
    const distanceKm = Number(approach?.miss_distance?.kilometers);
    const velocityKms = Number(
      approach?.relative_velocity?.kilometers_per_second,
    );

    if (!object.name || !Number.isFinite(distanceKm)) {
      continue;
    }

    if (!closest || distanceKm < closest.distanceKm) {
      closest = {
        id: object.id ?? object.name,
        name: object.name,
        distanceKm,
        velocityKms: Number.isFinite(velocityKms) ? velocityKms : 0,
        hazardous: Boolean(object.is_potentially_hazardous_asteroid),
      };
    }
  }

  return {
    count: typeof data?.element_count === "number" ? data.element_count : objects.length,
    hazardous: objects.filter((object) => object.is_potentially_hazardous_asteroid)
      .length,
    closest,
  };
}

async function loadPlanets(): Promise<EditionPlanet[]> {
  const query =
    "SELECT TOP 5 pl_name, hostname, disc_year, pl_rade, sy_dist, discoverymethod, disc_pubdate FROM pscomppars WHERE disc_year IS NOT NULL AND disc_pubdate IS NOT NULL ORDER BY disc_pubdate DESC, pl_name ASC";
  const data = await fetchJson(
    `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=${encodeURIComponent(query)}&format=json`,
  );

  if (!Array.isArray(data)) {
    throw new Error("Exoplanet payload incomplete");
  }

  return data.map((row) => ({
    name: String(row.pl_name ?? "Unknown"),
    host: String(row.hostname ?? "Unknown host"),
    year: typeof row.disc_year === "number" ? row.disc_year : null,
    radiusEarth: typeof row.pl_rade === "number" ? row.pl_rade : null,
    distancePc: typeof row.sy_dist === "number" ? row.sy_dist : null,
    method: row.discoverymethod ? String(row.discoverymethod) : null,
  }));
}

async function loadImages(): Promise<EditionImage[]> {
  const currentYear = new Date().getUTCFullYear();
  const baseUrl = `https://images-api.nasa.gov/search?q=&media_type=image&year_start=${currentYear}`;
  const initialData = await fetchJson(baseUrl);
  const totalHits = Number(initialData?.collection?.metadata?.total_hits ?? 0);
  const lastPage = Math.max(1, Math.ceil(totalHits / 100));
  const pageNumbers = lastPage > 1 ? [lastPage - 1, lastPage] : [lastPage];
  const pages = await Promise.all(
    pageNumbers.map((page) => fetchJson(`${baseUrl}&page=${page}`)),
  );
  const items = pages.flatMap((data) => data?.collection?.items ?? []);

  if (!Array.isArray(items)) {
    throw new Error("NASA Images payload incomplete");
  }

  return items
    .map((item: {
      data?: Array<{
        nasa_id?: string;
        title?: string;
        date_created?: string;
        description?: string;
        description_508?: string;
      }>;
      links?: Array<{ rel?: string; href?: string }>;
    }) => {
      const info = item.data?.[0];
      const thumbnailUrl = item.links?.find((link) => link.rel === "preview")?.href;

      if (!info?.nasa_id || !info.title || !thumbnailUrl) {
        return null;
      }

      return {
        id: info.nasa_id,
        title: info.title,
        date: info.date_created ?? null,
        thumbnailUrl,
        description: summarizeDescription(
          info.description_508 ?? info.description ?? null,
        ),
      };
    })
    .filter((item: EditionImage | null): item is EditionImage => item !== null)
    .sort((a, b) => {
      const aTime = a.date ? new Date(a.date).getTime() : 0;
      const bTime = b.date ? new Date(b.date).getTime() : 0;
      return bTime - aTime;
    })
    .slice(0, 5);
}

function summarizeDescription(value: string | null) {
  if (!value) {
    return null;
  }

  const text = value.replace(/\s+/g, " ").trim();
  if (text.length <= 220) {
    return text;
  }

  const shortened = text.slice(0, 220);
  const lastSpace = shortened.lastIndexOf(" ");
  return `${shortened.slice(0, lastSpace > 160 ? lastSpace : 220)}…`;
}

export async function getDailyEdition(): Promise<DailyEdition> {
  const now = new Date();
  const editionDate = formatDate(now);
  const errors: string[] = [];

  const [apod, neo, planets, images] = await Promise.all([
    loadApod().catch((error) => {
      errors.push(`APOD: ${error instanceof Error ? error.message : "failed"}`);
      return null;
    }),
    loadNeo(editionDate).catch((error) => {
      errors.push(`NEO: ${error instanceof Error ? error.message : "failed"}`);
      return null;
    }),
    loadPlanets().catch((error) => {
      errors.push(
        `Exoplanets: ${error instanceof Error ? error.message : "failed"}`,
      );
      return [] as EditionPlanet[];
    }),
    loadImages().catch((error) => {
      errors.push(
        `NASA Images: ${error instanceof Error ? error.message : "failed"}`,
      );
      return [] as EditionImage[];
    }),
  ]);

  return {
    publishedAt: now.toISOString(),
    editionDate,
    apod,
    neo,
    planets,
    images,
    errors,
  };
}

export function formatKm(value: number) {
  return new Intl.NumberFormat("en", {
    maximumFractionDigits: value >= 1_000_000 ? 0 : 0,
  }).format(Math.round(value));
}
