import Link from "next/link";
import { getEndpointStatuses } from "./lib/endpoint-status";

export const dynamic = "force-dynamic";

export default async function Home() {
  const endpoints = await getEndpointStatuses();
  const onlineCount = endpoints.filter(
    (endpoint) => endpoint.live === "online",
  ).length;
  const checkedAt = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "medium",
    timeZone: "UTC",
  }).format(new Date());

  return (
    <main id="main-content" className="shell">
      <header className="intro">
        <div>
          <Link className="brand" href="/" aria-label="Noru Search home">
            Noru Search
          </Link>
          <h1>NASA endpoint status</h1>
          <p>
            Only sources that passed at least 19 of 20 uncached
            payload-validity checks in the August 16, 2026 audit are listed.
          </p>
        </div>

        <dl className="summary" aria-label="Current endpoint summary">
          <div>
            <dt>Live now</dt>
            <dd>
              {onlineCount}/{endpoints.length}
            </dd>
          </div>
          <div>
            <dt>Audit threshold</dt>
            <dd>95%</dd>
          </div>
        </dl>
      </header>

      <section aria-labelledby="retained-heading">
        <div className="section-heading">
          <h2 id="retained-heading">Retained sources</h2>
          <p>Live check {checkedAt} UTC</p>
        </div>

        <div className="endpoint-list">
          {endpoints.map((endpoint) => {
            const auditRate = Math.round(
              (endpoint.auditPassed / endpoint.auditTotal) * 100,
            );

            return (
              <article className="endpoint-row" key={endpoint.id}>
                <div className="endpoint-name">
                  <span
                    className={`status-dot status-${endpoint.live}`}
                    aria-hidden="true"
                  />
                  <div>
                    <h3>{endpoint.name}</h3>
                    <p>{endpoint.provider}</p>
                  </div>
                </div>

                <code>{endpoint.displayUrl}</code>

                <dl className="endpoint-measures">
                  <div>
                    <dt>Recorded audit</dt>
                    <dd>
                      {auditRate}% ({endpoint.auditPassed}/
                      {endpoint.auditTotal})
                    </dd>
                  </div>
                  <div>
                    <dt>Live response</dt>
                    <dd>
                      {endpoint.live === "online" ? "Online" : "Degraded"} ·{" "}
                      {endpoint.latencyMs.toLocaleString()} ms
                    </dd>
                  </div>
                </dl>

                <p className="endpoint-detail">{endpoint.detail}</p>
              </article>
            );
          })}
        </div>
      </section>

      <aside className="audit-note" aria-labelledby="removed-heading">
        <h2 id="removed-heading">Removed after audit</h2>
        <p>
          Spaceflight News returned 12/20 valid responses. NASA TechPort
          returned 0/20 payloads in the shape required by the application.
          Their routes and interface modules were removed. Results came from
          20 sequential, uncached requests per source on August 16, 2026; GIBS
          was checked 20 times for each of its base and imagery tiles.
        </p>
      </aside>
    </main>
  );
}
