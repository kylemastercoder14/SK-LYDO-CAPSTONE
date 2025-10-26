"use client";

import React, { useMemo, useState } from "react";
import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { formatDateRange } from "little-date";
import { Events } from "@prisma/client";

const EventCalendar = ({ events }: { events: Events[] }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Convert event dates into Date objects
  const parsedEvents = useMemo(
    () =>
      events.map((event) => ({
        ...event,
        start: new Date(event.startDate),
        end: new Date(event.endDate),
      })),
    [events]
  );

  // Map: date string -> number of events (used for dots)
  const eventDays = useMemo(() => {
    const map: Record<string, number> = {};
    parsedEvents.forEach((event) => {
      const start = new Date(event.start);
      const end = new Date(event.end);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const key = d.toDateString();
        map[key] = (map[key] || 0) + 1;
      }
    });
    return map;
  }, [parsedEvents]);

  // Determine event status
  const getEventStatus = (event: { start: Date; end: Date }) => {
    const now = new Date();
    if (now < event.start) return "Upcoming";
    if (now >= event.start && now <= event.end) return "Ongoing";
    if (now > event.end) return "Completed";
    return "Pending";
  };

  // Events for the selected date
  const eventsForDate = useMemo(() => {
    if (!date) return [];
    return parsedEvents.filter((event) => {
      return (
        date >= new Date(event.start.setHours(0, 0, 0, 0)) &&
        date <= new Date(event.end.setHours(23, 59, 59, 999))
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
        components={{
          DayButton: (props) => (
            <CalendarDayButton {...props} eventDays={eventDays} />
          ),
        }}
      />

      <h3 className="font-medium text-lg mt-3 mb-2">
        {date
          ? `Events on ${date.toLocaleDateString()}`
          : "Select a date to see events"}
      </h3>

      <div className="flex w-full flex-col gap-2 h-[30vh] no-scrollbar overflow-y-auto">
        {eventsForDate.length > 0 ? (
          eventsForDate.map((event) => {
            const status = getEventStatus(event);
            const statusColor =
              status === "Ongoing"
                ? "text-green-600"
                : status === "Upcoming"
                ? "text-blue-600"
                : status === "Completed"
                ? "text-gray-500"
                : "text-yellow-600";

            return (
              <div
                key={event.id}
                className="bg-muted relative rounded-md p-2 pl-6 text-sm after:absolute after:inset-y-2 after:left-2 after:w-1 after:bg-primary/70 after:rounded-full"
              >
                <div className="flex justify-between items-center">
                  <div className="font-medium">{event.name}</div>
                  <span className={`text-xs font-semibold ${statusColor}`}>
                    {status}
                  </span>
                </div>
                <div className="text-muted-foreground text-xs">
                  {formatDateRange(event.start, event.end)}
                </div>
                <p
                  className="text-xs text-muted-foreground mt-1"
                  dangerouslySetInnerHTML={{ __html: event.description }}
                />
              </div>
            );
          })
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
