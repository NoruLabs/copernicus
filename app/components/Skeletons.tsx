import { FeedHeader } from "./FeedHeader";

function Bone({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={`skeleton-bone ${className}`} />;
}

export function HomeSkeleton() {
  return (
    <>
      <FeedHeader title={"What's new today"} />
      <section className="feature-section" aria-busy="true" aria-live="polite">
        <div className="feature-heading">
          <Bone className="skeleton-title" />
          <Bone className="skeleton-label" />
        </div>
        <div className="skeleton-plate" />
        <div className="story-copy skeleton-copy">
          <Bone className="skeleton-heading" />
          <Bone className="skeleton-meta" />
          <Bone className="skeleton-line" />
          <Bone className="skeleton-line" />
          <Bone className="skeleton-line short" />
        </div>
      </section>
      <section className="feature-section">
        <div className="feature-heading">
          <Bone className="skeleton-title" />
          <Bone className="skeleton-label" />
        </div>
        <div className="facts-list">
          {Array.from({ length: 3 }, (_, index) => (
            <div className="fact-row skeleton-fact" key={index}>
              <Bone className="skeleton-value" />
              <div>
                <Bone className="skeleton-heading" />
                <Bone className="skeleton-line" />
                <Bone className="skeleton-line short" />
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="feature-section">
        <div className="feature-heading">
          <Bone className="skeleton-title" />
          <Bone className="skeleton-label" />
        </div>
        <div className="planet-list">
          {Array.from({ length: 5 }, (_, index) => (
            <div className="planet-row skeleton-row" key={index}>
              <div>
                <Bone className="skeleton-heading" />
                <Bone className="skeleton-meta" />
              </div>
              <Bone className="skeleton-figure" />
            </div>
          ))}
        </div>
      </section>
      <p className="sr-only">Loading today&apos;s edition</p>
    </>
  );
}

export function ApodSkeleton() {
  return (
    <>
      <FeedHeader title="Astronomy picture of the day" />
      <article className="apod-detail" aria-busy="true">
        <div className="skeleton-plate apod-detail-media" />
        <div className="detail-copy skeleton-copy">
          <Bone className="skeleton-heading wide" />
          <Bone className="skeleton-meta" />
          <Bone className="skeleton-line" />
          <Bone className="skeleton-line" />
          <Bone className="skeleton-line" />
          <Bone className="skeleton-line short" />
        </div>
      </article>
      <p className="sr-only">Loading astronomy picture</p>
    </>
  );
}

export function ArchiveListSkeleton({ title }: { title: string }) {
  return (
    <>
      <FeedHeader title={title} />
      <div className="archive-list" aria-busy="true">
        {Array.from({ length: 6 }, (_, index) => (
          <article className="archive-record skeleton-record" key={index}>
            <div className="record-heading">
              <div>
                <Bone className="skeleton-heading" />
                <Bone className="skeleton-meta" />
              </div>
              <Bone className="skeleton-label" />
            </div>
            <div className="data-grid skeleton-grid">
              {Array.from({ length: 6 }, (_, cell) => (
                <div key={cell}>
                  <Bone className="skeleton-meta" />
                  <Bone className="skeleton-line short" />
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
      <p className="sr-only">Loading archive records</p>
    </>
  );
}

export function ImageLibrarySkeleton() {
  return (
    <>
      <FeedHeader title="Image Library" />
      <div className="masonry" aria-busy="true">
        {Array.from({ length: 9 }, (_, index) => (
          <article className="image-tile" key={index}>
            <div
              className={`skeleton-tile-media ${index % 3 === 0 ? "tall" : index % 3 === 1 ? "short" : ""}`}
            />
            <div className="image-tile-copy">
              <div>
                <Bone className="skeleton-heading" />
                <Bone className="skeleton-meta" />
              </div>
              <Bone className="skeleton-icon" />
            </div>
          </article>
        ))}
      </div>
      <p className="sr-only">Loading NASA images</p>
    </>
  );
}
