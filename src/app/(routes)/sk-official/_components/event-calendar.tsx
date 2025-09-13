"use client";

import React, { useMemo, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { formatDateRange } from "little-date";
import { Events } from "@prisma/client";

const EventCalendar = ({ events }: { events: Events[] }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Convert DB events into Date objects for easier comparison
  const parsedEvents = useMemo(
    () =>
      events.map((event) => ({
        ...event,
        start: new Date(event.startDate),
        end: new Date(event.endDate),
      })),
    [events]
  );

  // Highlighted dates (all start dates of events)
  const eventDates = useMemo(
    () => parsedEvents.map((event) => event.start),
    [parsedEvents]
  );

  // Events for the selected day
  const eventsForDate = useMemo(() => {
    if (!date) return [];
    return parsedEvents.filter((event) => {
      const day = date.toDateString();
      return (
        event.start.toDateString() === day || event.end.toDateString() === day
      );
    });
  }, [date, parsedEvents]);

  return (
    <div>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-lg bg-card w-full border"
        modifiers={{
          event: eventDates,
        }}
        modifiersClassNames={{
          event: "bg-primary/20 text-primary rounded-full",
        }}
      />
      <h3 className="font-medium text-lg mt-3 mb-2">
        {date
          ? `Events on ${date.toLocaleDateString()}`
          : "Select a date to see events"}
      </h3>
      <div className="flex w-full flex-col gap-2 h-[30vh] no-scrollbar overflow-y-auto">
        {eventsForDate.length > 0 ? (
          eventsForDate.map((event) => (
            <div
              key={event.id}
              className="bg-muted after:bg-primary/70 relative rounded-md p-2 pl-6 text-sm after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full"
            >
              <div className="font-medium">{event.name}</div>
              <div className="text-muted-foreground text-xs">
                {formatDateRange(event.start, event.end)}
              </div>
              <p className="text-xs text-muted-foreground">
                {event.description}
              </p>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground text-sm">
            No events scheduled for this date.
          </p>
        )}
      </div>
    </div>
  );
};

export default EventCalendar;
