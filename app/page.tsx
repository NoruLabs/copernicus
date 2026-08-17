import { LocalDateTime } from "./components/LocalDateTime";
import { Sidebar } from "./components/Sidebar";
import { formatKm, getDailyEdition } from "./lib/edition";

export const dynamic = "force-dynamic";

function distanceLabel(km: number) {
  if (km >= 1_000_000) {
    return `${(km / 1_000_000).toFixed(1)} million km`;
  }

  return `${formatKm(km)} km`;
}

function moonDistanceLabel(km: number) {
  const lunarDistances = km / 384_400;
  return `${lunarDistances.toFixed(lunarDistances >= 10 ? 0 : 1)} times the average Earth–Moon distance`;
}

function planetMeasure(
  radiusEarth: number | null,
  distancePc: number | null,
) {
  const facts: string[] = [];

  if (radiusEarth != null) {
    facts.push(`${radiusEarth.toFixed(2)}× Earth's radius`);
  }

  if (distancePc != null) {
    facts.push(`${Math.round(distancePc * 3.26156).toLocaleString()} light-years away`);
  }

  return facts.length > 0 ? facts.join(" · ") : "Measurements unavailable";
}

export default async function Home() {
  const edition = await getDailyEdition();

  return (
    <div className="app-shell">
      <Sidebar />

      <main id="main-content" className="feed">
        <header className="feed-header" id="home">
          <h1>Home</h1>
          <LocalDateTime />
        </header>

        <section className="feature-section apod-section" id="apod">
          <div className="feature-heading">
            <h2>Astronomy picture of the day</h2>
            <p>NASA APOD</p>
          </div>

          {edition.apod ? (
            <article className="apod-story">
              <div className="plate-frame">
                {edition.apod.mediaType === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={edition.apod.url}
                    alt={edition.apod.title}
                  />
                ) : edition.apod.mediaType === "video" ? (
                  <iframe
                    src={edition.apod.url}
                    title={edition.apod.title}
                    allowFullScreen
                  />
                ) : (
                  <p className="empty">Unsupported media for today&apos;s plate.</p>
                )}
              </div>
              <div className="story-copy">
                <h3>{edition.apod.title}</h3>
                <p className="meta">
                  {edition.apod.date}
                  {edition.apod.copyright
                    ? ` · Credit: ${edition.apod.copyright}`
                    : ""}
                </p>
                <p className="explanation">{edition.apod.explanation}</p>
              </div>
            </article>
          ) : (
            <p className="empty">
              Today&apos;s astronomy picture could not be loaded.
            </p>
          )}
        </section>

        <section className="feature-section" id="near-earth">
          <div className="feature-heading">
            <h2>Near Earth today</h2>
            <p>NASA NEO</p>
          </div>

          {edition.neo ? (
            <div className="facts-list">
              <article className="fact-row">
                <p className="fact-value">{edition.neo.count}</p>
                <div>
                  <h3>Objects making a close approach</h3>
                  <p>
                    NASA lists these asteroids and comets near Earth for{" "}
                    {edition.editionDate}.
                  </p>
                </div>
              </article>

              <article className="fact-row">
                <p className="fact-value">{edition.neo.hazardous}</p>
                <div>
                  <h3>Potentially hazardous objects flagged</h3>
                  <p>
                    A flag means an object is large enough and passes close
                    enough to receive extra attention—not that an impact is
                    expected.
                  </p>
                </div>
              </article>

              <article className="fact-row">
                <p className="fact-value fact-distance">
                  {edition.neo.closest
                    ? distanceLabel(edition.neo.closest.distanceKm)
                    : "—"}
                </p>
                <div>
                  <h3>Closest listed approach</h3>
                  <p>
                    {edition.neo.closest
                      ? `${edition.neo.closest.name} passes at about ${moonDistanceLabel(edition.neo.closest.distanceKm)}, moving ${edition.neo.closest.velocityKms.toFixed(1)} km each second.`
                      : "No close-approach details are available today."}
                  </p>
                </div>
              </article>
            </div>
          ) : (
            <p className="empty">Near-Earth object data is unavailable.</p>
          )}
        </section>

        <section className="feature-section" id="exoplanets">
          <div className="feature-heading">
            <h2>Five recent discoveries</h2>
            <p>NASA Exoplanet Archive</p>
          </div>

          {edition.planets.length > 0 ? (
            <div className="planet-list">
              {edition.planets.map((planet) => (
                <article className="planet-row" key={`${planet.name}-${planet.host}`}>
                  <div>
                    <h3>{planet.name}</h3>
                    <p className="meta">
                      Orbits {planet.host}
                      {planet.method ? ` · Found by ${planet.method}` : ""}
                      {planet.year ? ` · Announced ${planet.year}` : ""}
                    </p>
                  </div>
                  <p className="figure">{planetMeasure(planet.radiusEarth, planet.distancePc)}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="empty">No exoplanet rows available for this edition.</p>
          )}
        </section>

        <section className="feature-section" id="images">
          <div className="feature-heading">
            <h2>Five latest image briefs</h2>
            <p>NASA Image Library</p>
          </div>

          {edition.images.length > 0 ? (
            <div className="image-list">
              {edition.images.map((image) => (
                <article className="image-row" key={image.id}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="thumb"
                    src={image.thumbnailUrl}
                    alt={image.title}
                  />
                  <div>
                    <h3>{image.title}</h3>
                    <p className="meta">
                      {image.date
                        ? new Intl.DateTimeFormat("en", {
                            dateStyle: "medium",
                          }).format(new Date(image.date))
                        : "Date unavailable"}
                    </p>
                    <p className="image-description">
                      {image.description ?? "NASA did not provide a description for this image."}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="empty">No image briefs available for this edition.</p>
          )}
        </section>

        {edition.errors.length > 0 ? (
          <aside className="errors" aria-label="Data issues">
            <h2>Data notes</h2>
            <ul>
              {edition.errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </aside>
        ) : null}

        <footer className="colophon">
          Data from NASA APOD, Near Earth Object Web Service, Exoplanet
          Archive, and Image Library.
        </footer>
      </main>
    </div>
  );
}
