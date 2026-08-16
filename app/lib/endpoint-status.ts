import "server-only";

export type EndpointStatus = {
  id: string;
  name: string;
  provider: string;
  displayUrl: string;
  auditPassed: number;
  auditTotal: number;
  live: "online" | "degraded";
  latencyMs: number;
  detail: string;
};

type EndpointDefinition = Omit<
  EndpointStatus,
  "live" | "latencyMs" | "detail"
> & {
  check: (signal: AbortSignal) => Promise<string>;
};

const NASA_API_KEY = process.env.NASA_API_KEY || "DEMO_KEY";
const EXOPLANET_QUERY =
  "SELECT TOP 5 pl_name, hostname, disc_year FROM pscomppars WHERE disc_year IS NOT NULL ORDER BY disc_year DESC";

async function readJson(response: Response) {
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}

async function readImage(response: Response) {
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const contentType = response.headers.get("content-type") ?? "";
  const body = await response.arrayBuffer();

  if (!contentType.startsWith("image/") || body.byteLength < 1_000) {
    throw new Error("Invalid image payload");
  }
}

const endpoints: EndpointDefinition[] = [
  {
    id: "apod",
    name: "Astronomy Picture of the Day",
    provider: "NASA Open APIs",
    displayUrl: "api.nasa.gov/planetary/apod",
    auditPassed: 20,
    auditTotal: 20,
    check: async (signal) => {
      const response = await fetch(
        `https://api.nasa.gov/planetary/apod?api_key=${encodeURIComponent(NASA_API_KEY)}`,
        { cache: "no-store", signal },
      );
      const data = await readJson(response);

      if (!data?.title || !data?.date || !data?.url) {
        throw new Error("Invalid APOD payload");
      }

      return `Valid entry for ${data.date}`;
    },
  },
  {
    id: "neo",
    name: "Near Earth Objects",
    provider: "NASA Open APIs",
    displayUrl: "api.nasa.gov/neo/rest/v1/feed",
    auditPassed: 20,
    auditTotal: 20,
    check: async (signal) => {
      const response = await fetch(
        `https://api.nasa.gov/neo/rest/v1/feed?start_date=2025-08-01&end_date=2025-08-01&api_key=${encodeURIComponent(NASA_API_KEY)}`,
        { cache: "no-store", signal },
      );
      const data = await readJson(response);

      if (
        typeof data?.element_count !== "number" ||
        !data?.near_earth_objects
      ) {
        throw new Error("Invalid NEO payload");
      }

      return `${data.element_count} objects in sample`;
    },
  },
  {
    id: "images",
    name: "NASA Image and Video Library",
    provider: "NASA",
    displayUrl: "images-api.nasa.gov/search",
    auditPassed: 20,
    auditTotal: 20,
    check: async (signal) => {
      const response = await fetch(
        "https://images-api.nasa.gov/search?q=earth&media_type=image&page=1",
        { cache: "no-store", signal },
      );
      const data = await readJson(response);
      const items = data?.collection?.items;

      if (!Array.isArray(items) || items.length === 0) {
        throw new Error("Invalid image search payload");
      }

      return `${items.length} images in sample`;
    },
  },
  {
    id: "exoplanets",
    name: "NASA Exoplanet Archive",
    provider: "NASA / Caltech IPAC",
    displayUrl: "exoplanetarchive.ipac.caltech.edu/TAP/sync",
    auditPassed: 20,
    auditTotal: 20,
    check: async (signal) => {
      const response = await fetch(
        `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=${encodeURIComponent(EXOPLANET_QUERY)}&format=json`,
        { cache: "no-store", signal },
      );
      const data = await readJson(response);

      if (!Array.isArray(data) || data.length === 0 || !data[0]?.pl_name) {
        throw new Error("Invalid exoplanet payload");
      }

      return `${data.length} planets in sample`;
    },
  },
  {
    id: "gibs",
    name: "Global Imagery Browse Services",
    provider: "NASA EOSDIS",
    displayUrl: "gibs.earthdata.nasa.gov/wmts",
    auditPassed: 40,
    auditTotal: 40,
    check: async (signal) => {
      const urls = [
        "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_ShadedRelief_Bathymetry/default/2023-01-01/GoogleMapsCompatible_Level8/3/4/4.jpeg",
        "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/2026-08-14/GoogleMapsCompatible_Level9/3/4/4.jpg",
      ];

      await Promise.all(
        urls.map(async (url) => {
          const response = await fetch(url, { cache: "no-store", signal });
          await readImage(response);
        }),
      );

      return "Base and imagery tiles valid";
    },
  },
];

async function checkEndpoint(
  endpoint: EndpointDefinition,
): Promise<EndpointStatus> {
  const startedAt = performance.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);
  const { check, ...publicEndpoint } = endpoint;

  try {
    const detail = await check(controller.signal);
    return {
      ...publicEndpoint,
      live: "online",
      latencyMs: Math.round(performance.now() - startedAt),
      detail,
    };
  } catch (error) {
    const detail =
      error instanceof Error && error.name === "AbortError"
        ? "Timed out after 20 seconds"
        : error instanceof Error
          ? error.message
          : "Check failed";

    return {
      ...publicEndpoint,
      live: "degraded",
      latencyMs: Math.round(performance.now() - startedAt),
      detail,
    };
  } finally {
    clearTimeout(timeout);
  }
}

export async function getEndpointStatuses() {
  return Promise.all(endpoints.map(checkEndpoint));
}
