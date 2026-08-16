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
};

export type EditionEarth = {
  tileUrl: string;
  label: string;
  date: string;
};

export type DailyEdition = {
  publishedAt: string;
  editionDate: string;
  apod: EditionApod | null;
  neo: EditionNeo | null;
  planets: EditionPlanet[];
  images: EditionImage[];
  earth: EditionEarth | null;
  errors: string[];
};

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function gibsDate(date: Date) {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() - 2);
  return formatDate(d);
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
    "SELECT TOP 6 pl_name, hostname, disc_year, pl_rade, sy_dist, discoverymethod FROM pscomppars WHERE disc_year IS NOT NULL ORDER BY disc_year DESC";
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
  const data = await fetchJson(
    "https://images-api.nasa.gov/search?q=earth&media_type=image&page=1",
  );
  const items = data?.collection?.items;

  if (!Array.isArray(items)) {
    throw new Error("NASA Images payload incomplete");
  }

  return items
    .slice(0, 4)
    .map((item: {
      data?: Array<{
        nasa_id?: string;
        title?: string;
        date_created?: string;
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
      };
    })
    .filter((item: EditionImage | null): item is EditionImage => item !== null);
}

async function loadEarth(): Promise<EditionEarth> {
  const date = gibsDate(new Date());
  const tileUrl = `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/${date}/GoogleMapsCompatible_Level9/3/4/4.jpg`;
  const response = await fetch(tileUrl, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`GIBS HTTP ${response.status}`);
  }

  const contentType = response.headers.get("content-type") ?? "";
  const body = await response.arrayBuffer();

  if (!contentType.startsWith("image/") || body.byteLength < 1000) {
    throw new Error("GIBS tile invalid");
  }

  return {
    tileUrl,
    label: "MODIS Terra true color",
    date,
  };
}

export async function getDailyEdition(): Promise<DailyEdition> {
  const now = new Date();
  const editionDate = formatDate(now);
  const errors: string[] = [];

  const [apod, neo, planets, images, earth] = await Promise.all([
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
    loadEarth().catch((error) => {
      errors.push(`GIBS: ${error instanceof Error ? error.message : "failed"}`);
      return null;
    }),
  ]);

  return {
    publishedAt: now.toISOString(),
    editionDate,
    apod,
    neo,
    planets,
    images,
    earth,
    errors,
  };
}

export function formatKm(value: number) {
  return new Intl.NumberFormat("en", {
    maximumFractionDigits: value >= 1_000_000 ? 0 : 0,
  }).format(Math.round(value));
}

export function formatEditionDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}
