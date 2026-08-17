import ColorFlairButton from "../../components/pixel-perfect/color-flair-button";
import { ApodCalendar } from "../components/ApodCalendar";
import { PageShell } from "../components/PageShell";
import { getApod } from "../lib/archive";

export const dynamic = "force-dynamic";

export default async function ApodPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date } = await searchParams;
  const today = new Date().toISOString().slice(0, 10);
  const requestedDate =
    date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : undefined;
  const apod = await getApod(requestedDate).catch(() => null);

  return (
    <PageShell title="Astronomy picture of the day">
      {apod ? (
        <article className="apod-detail">
          <div className="plate-frame apod-detail-media">
            {apod.mediaType === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={apod.url} alt={apod.title} />
            ) : apod.mediaType === "video" ? (
              <iframe src={apod.url} title={apod.title} allowFullScreen />
            ) : (
              <p className="empty">This edition uses an unsupported media type.</p>
            )}
          </div>
          <div className="detail-copy">
            <div className="detail-title-row">
              <div>
                <h2>{apod.title}</h2>
                <p className="meta">
                  {apod.date}
                  {apod.copyright ? ` · Credit: ${apod.copyright}` : ""}
                </p>
              </div>
              <div className="detail-actions">
                <ApodCalendar
                  key={apod.date}
                  selected={apod.date}
                  today={today}
                />
                {apod.mediaType === "image" ? (
                  <ColorFlairButton
                    className="icon-button"
                    href={`/api/archive/apod-download?date=${apod.date}`}
                    label={`Download ${apod.title}`}
                  >
                    <svg aria-hidden="true" viewBox="0 0 24 24">
                      <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 20h16" />
                    </svg>
                  </ColorFlairButton>
                ) : null}
              </div>
            </div>
            <p className="detail-explanation">{apod.explanation}</p>
          </div>
        </article>
      ) : (
        <div className="empty-apod">
          <p className="empty">
            That APOD edition could not be loaded. Choose another date and try
            again.
          </p>
          <ApodCalendar
            selected={
              requestedDate && requestedDate <= today ? requestedDate : today
            }
            today={today}
          />
        </div>
      )}
    </PageShell>
  );
}
