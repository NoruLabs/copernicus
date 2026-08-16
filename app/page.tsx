import Link from "next/link";
import {
  formatEditionDate,
  formatKm,
  getDailyEdition,
} from "./lib/edition";

export const dynamic = "force-dynamic";

function distanceLabel(km: number) {
  if (km >= 1_000_000) {
    return `${formatKm(km / 1_000_000)} million km`;
  }

  return `${formatKm(km)} km`;
}

export default async function Home() {
  const edition = await getDailyEdition();
  const readableDate = formatEditionDate(edition.editionDate);

  return (
    <main id="main-content" className="edition">
      <header className="masthead">
        <div className="masthead-top">
          <Link className="brand" href="/" aria-label="Copernicus home">
            Copernicus
          </Link>
          <p className="dateline">{readableDate}</p>
        </div>
        <p className="deck">
          Today&apos;s NASA edition. Imagery and measurements from verified
          feeds, printed as one almanac.
        </p>
      </header>

      <section className="folio" aria-label="Lead plate and ephemeris">
        <article className="plate">
          {edition.apod ? (
            <>
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
              <h1>{edition.apod.title}</h1>
              <p className="note">
                NASA Astronomy Picture of the Day · {edition.apod.date}
                {edition.apod.copyright ? ` · Credit: ${edition.apod.copyright}` : ""}
              </p>
              <p>{edition.apod.explanation}</p>
            </>
          ) : (
            <p className="empty">
              Today&apos;s APOD plate could not be loaded. The rest of the
              edition continues below.
            </p>
          )}
        </article>

        <aside className="ephemeris" aria-labelledby="ephemeris-heading">
          <h2 id="ephemeris-heading">Ephemeris</h2>
          <table className="ledger">
            <tbody>
              <tr>
                <th scope="row">Near-Earth objects</th>
                <td>
                  {edition.neo ? edition.neo.count : "—"}
                  <span className="callout">
                    Objects with a close approach dated {edition.editionDate}.
                  </span>
                </td>
              </tr>
              <tr>
                <th scope="row">Hazard flagged</th>
                <td>
                  {edition.neo ? edition.neo.hazardous : "—"}
                  <span className="callout">
                    Count of potentially hazardous asteroids in today&apos;s
                    feed.
                  </span>
                </td>
              </tr>
              <tr>
                <th scope="row">Closest approach</th>
                <td>
                  {edition.neo?.closest
                    ? distanceLabel(edition.neo.closest.distanceKm)
                    : "—"}
                  <span className="callout">
                    {edition.neo?.closest
                      ? `${edition.neo.closest.name} at ${edition.neo.closest.velocityKms.toFixed(1)} km/s${edition.neo.closest.hazardous ? ", hazard flagged" : ""}.`
                      : "No approach sample available."}
                  </span>
                </td>
              </tr>
              <tr>
                <th scope="row">Recent exoplanets</th>
                <td>
                  {edition.planets.length || "—"}
                  <span className="callout">
                    Newest confirmed planets pulled for this edition.
                  </span>
                </td>
              </tr>
              <tr>
                <th scope="row">Earth plate date</th>
                <td>
                  {edition.earth?.date ?? "—"}
                  <span className="callout">
                    GIBS true-color tile, usually lagged by two days.
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </aside>
      </section>

      <div className="lower">
        <section className="section" aria-labelledby="planets-heading">
          <div className="section-head">
            <h2 className="section-title" id="planets-heading">
              Recent discoveries
            </h2>
            <p className="source">NASA Exoplanet Archive</p>
          </div>

          {edition.planets.length > 0 ? (
            <div className="planet-list">
              {edition.planets.map((planet) => (
                <article className="planet-row" key={`${planet.name}-${planet.host}`}>
                  <div>
                    <h3>{planet.name}</h3>
                    <p className="meta">
                      Host {planet.host}
                      {planet.method ? ` · ${planet.method}` : ""}
                      {planet.year ? ` · ${planet.year}` : ""}
                    </p>
                  </div>
                  <p className="figure">
                    {planet.radiusEarth != null
                      ? `${planet.radiusEarth.toFixed(2)} R⊕`
                      : planet.distancePc != null
                        ? `${planet.distancePc.toFixed(1)} pc`
                        : "measured"}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <p className="empty">No exoplanet rows available for this edition.</p>
          )}
        </section>

        <section className="section" aria-labelledby="images-heading">
          <div className="section-head">
            <h2 className="section-title" id="images-heading">
              Image briefs
            </h2>
            <p className="source">NASA Image Library</p>
          </div>

          {edition.images.length > 0 ? (
            <div className="image-list">
              {edition.images.map((image) => (
                <article className="image-row" key={image.id}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="thumb"
                    src={image.thumbnailUrl}
                    alt=""
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
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="empty">No image briefs available for this edition.</p>
          )}

          {edition.earth ? (
            <div className="earth-block" style={{ marginTop: "1.5rem" }}>
              <div className="section-head">
                <h2 className="section-title">Earth observation</h2>
                <p className="source">NASA GIBS</p>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={edition.earth.tileUrl}
                alt={`${edition.earth.label} for ${edition.earth.date}`}
              />
              <p className="meta">
                {edition.earth.label} · {edition.earth.date}
              </p>
            </div>
          ) : null}
        </section>
      </div>

      {edition.errors.length > 0 ? (
        <aside className="errors" aria-label="Edition issues">
          <h2 className="section-title">Edition notes</h2>
          <ul>
            {edition.errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </aside>
      ) : null}

      <footer className="colophon">
        Copernicus publishes only from sources retained after the August 16,
        2026 reliability audit. Removed feeds are not shown as empty news.
      </footer>
    </main>
  );
}
