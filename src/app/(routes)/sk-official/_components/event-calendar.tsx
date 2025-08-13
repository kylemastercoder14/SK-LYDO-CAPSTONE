"use client";

import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { formatDateRange } from "little-date";

const events = [
  {
    title: "Team Sync Meeting",
    from: "2025-06-12T09:00:00",
    to: "2025-06-12T10:00:00",
  },
  {
    title: "Design Review",
    from: "2025-06-12T11:30:00",
    to: "2025-06-12T12:30:00",
  },
  {
    title: "Client Presentation",
    from: "2025-06-12T14:00:00",
    to: "2025-06-12T15:00:00",
  },
  {
    title: "Client Presentation",
    from: "2025-06-12T14:00:00",
    to: "2025-06-12T15:00:00",
  },
  {
    title: "Client Presentation",
    from: "2025-06-12T14:00:00",
    to: "2025-06-12T15:00:00",
  },
  {
    title: "Client Presentation",
    from: "2025-06-12T14:00:00",
    to: "2025-06-12T15:00:00",
  },
  {
    title: "Client Presentation",
    from: "2025-06-12T14:00:00",
    to: "2025-06-12T15:00:00",
  },
];

const EventCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  return (
    <div>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-lg bg-card w-full border"
      />
      <h3 className="font-medium text-lg mt-3 mb-2">Events & Activities Schedule</h3>
      <div className="flex w-full flex-col gap-2 h-[25vh] no-scrollbar overflow-y-auto">
        {events.map((event) => (
          <div
            key={event.title}
            className="bg-muted after:bg-primary/70 relative rounded-md p-2 pl-6 text-sm after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full"
          >
            <div className="font-medium">{event.title}</div>
            <div className="text-muted-foreground text-xs">
              {formatDateRange(new Date(event.from), new Date(event.to))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventCalendar;
