"use client";

import { useEffect, useState } from "react";

function formatLocalDateTime(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date);
}

export function LocalDateTime() {
  const [value, setValue] = useState<{
    label: string;
    dateTime: string;
  } | null>(null);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setValue({
        label: formatLocalDateTime(now),
        dateTime: now.toISOString(),
      });
    };
    update();

    const timer = window.setInterval(update, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <time
      className="local-time"
      dateTime={value?.dateTime}
      suppressHydrationWarning
    >
      {value?.label ?? "Local date and time"}
    </time>
  );
}
