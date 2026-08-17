"use client";

import { CalendarDays } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Calendar } from "../../components/ui/calendar";

function asDate(value: string) {
  return new Date(`${value}T12:00:00`);
}

function asIsoDate(value: Date) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function ApodCalendar({
  selected,
  today,
}: {
  selected: string;
  today: string;
}) {
  const router = useRouter();
  const [date, setDate] = React.useState<Date | undefined>(asDate(selected));
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function close(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <div className="apod-calendar-control" ref={rootRef}>
      <button
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label="Choose APOD date"
        className="square-icon-button"
        onClick={() => setOpen((value) => !value)}
        title="Choose APOD date"
        type="button"
      >
        <CalendarDays aria-hidden="true" />
      </button>
      <div
        aria-label="Choose APOD date"
        className="apod-calendar-popover"
        data-open={open}
        role="dialog"
      >
        <Calendar
          captionLayout="dropdown"
          className="rounded-lg border"
          disabled={{ before: asDate("1995-06-16"), after: asDate(today) }}
          endMonth={asDate(today)}
          mode="single"
          onSelect={(nextDate) => {
            if (!nextDate) return;
            setDate(nextDate);
            setOpen(false);
            router.push(`/apod?date=${asIsoDate(nextDate)}`);
          }}
          selected={date}
          startMonth={asDate("1995-06-16")}
        />
      </div>
    </div>
  );
}
