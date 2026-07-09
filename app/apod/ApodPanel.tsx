"use client";

import { useState } from "react";
import { RefreshCw, ExternalLink } from "lucide-react";
import { useApod } from "../hooks/useApod";
import { DataCard } from "../components/ui/DataCard";
import { ErrorState } from "../components/ui/ErrorState";
import { ApodGallery } from "./ApodGallery";

export function ApodPanel() {
  const [date, setDate] = useState<string>("");
  const { data, isLoading, error, refetch, isFetching } = useApod(
    date || undefined
  );

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 md:animate-pulse">
        <div className="flex gap-3">
          <div className="h-10 w-48 bg-bg-card rounded-xl" />
          <div className="h-10 w-24 bg-bg-card rounded-xl" />
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-2/3 xl:w-3/4 flex flex-col gap-6">
            <div className="w-full aspect-[16/9] rounded-3xl bg-bg-card glass-card" />
            <div className="space-y-4">
              <div className="h-8 w-1/3 bg-bg-card rounded-md" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-bg-card rounded-md" />
                <div className="h-4 w-11/12 bg-bg-card rounded-md" />
                <div className="h-4 w-3/4 bg-bg-card rounded-md" />
              </div>
            </div>
          </div>
          <div className="lg:w-1/3 xl:w-1/4">
            <div className="h-12 w-full bg-bg-card rounded-xl mb-4" />
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
              <div className="h-32 bg-bg-card rounded-2xl" />
              <div className="h-32 bg-bg-card rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (error)
    return (
      <ErrorState message={error.message || "An unexpected error occurred."} onRetry={() => refetch()} />
    );
  if (!data) return null;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 animate-fade-in">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
          <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min="1995-06-16"
              max={new Date().toISOString().split("T")[0]}
              className="flex items-center gap-2 rounded-xl border border-border bg-bg-card px-3 py-2 text-sm text-text-primary transition-all hover:border-border-hover [color-scheme:dark]"
            />
          <button
            onClick={() => {
              setDate("");
              refetch();
            }}
            disabled={isFetching}
            className="flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm text-text-secondary transition-all hover:border-border-hover hover:text-text-primary active:scale-95 disabled:opacity-50"
          >
            <RefreshCw size={14} className={isFetching ? "animate-spin" : ""} />
            Today
          </button>
        </div>

      <div className="flex w-full flex-col gap-6">
        <div className="w-full">
          <DataCard>
            <div className="space-y-5">
          {/* Title & Date */}
          <div>
            <h2 className="text-xl font-semibold text-text-primary">
              {data.title}
            </h2>
            <p className="mt-1 text-sm text-text-muted">
              {data.date}
              {data.copyright && <> &middot; &copy; {data.copyright}</>}
            </p>
          </div>

          {/* Media */}
          {data.media_type === "image" ? (
            <div className="overflow-hidden rounded-xl">
              <img
                src={data.url}
                alt={data.title}
                className="w-full object-cover"
                loading="lazy"
              />
            </div>
          ) : data.url.includes("youtube.com") || data.url.includes("youtu.be") ? (
            <div className="aspect-video overflow-hidden rounded-xl bg-black">
              <iframe
                src={data.url}
                title={data.title}
                className="h-full w-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl bg-black">
              <video
                src={data.url}
                controls
                className="w-full"
                preload="metadata"
                poster={data.thumbnail_url}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {/* Explanation */}
          <p className="text-sm leading-relaxed text-text-secondary">
            {data.explanation}
          </p>

          {/* HD Link */}
          {data.hdurl && (
            <a
              href={data.hdurl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-accent-soft px-3 py-1.5 text-sm font-medium text-accent transition-all hover:opacity-80"
            >
              View HD
              <ExternalLink size={12} />
            </a>
          )}
        </div>
      </DataCard>
      </div>

      {/* Gallery (Below on all screens) */}
      <div className="w-full">
        <ApodGallery
          onSelectDate={(d) => setDate(d)}
        />
      </div>
      </div>
    </div>
  );
}

