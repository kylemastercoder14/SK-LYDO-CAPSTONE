"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { ProjectProposal } from "@prisma/client";

// chart config
const chartConfig = {
  participants: {
    label: "SK Participants",
    color: "hsl(var(--chart-2))",
  },
} satisfies Record<string, { label: string; color: string }>;

type ChartPoint = {
  date: string;
  participants: number;
  title: string;
};

export function SKParticipationChart({
  skParticipant,
}: {
  skParticipant: ProjectProposal[];
}) {
  const [timeRange, setTimeRange] = React.useState("90d");

  // 🧮 Group projects by date and include their titles
  const groupedByDate = skParticipant.reduce<
    Record<string, { count: number; titles: string[] }>
  >((acc, proj) => {
    const date = proj.createdAt.toISOString().split("T")[0];
    if (!acc[date]) acc[date] = { count: 0, titles: [] };
    acc[date].count += 1;
    acc[date].titles.push(proj.title);
    return acc;
  }, {});

  // Transform DB data → chart data
  const transformedData: ChartPoint[] = Object.entries(groupedByDate).map(
    ([date, { count, titles }]) => ({
      date,
      participants: count,
      title: titles.join(", "), // Combine titles for tooltip display
    })
  );

  // Filter by time range
  const referenceDate = new Date();
  let daysToSubtract = 30;
  if (timeRange === "90d") daysToSubtract = 90;
  else if (timeRange === "7d") daysToSubtract = 7;

  const startDate = new Date(referenceDate);
  startDate.setDate(startDate.getDate() - daysToSubtract);

  const filteredData = transformedData.filter((item) => {
    const date = new Date(item.date);
    return date >= startDate && date <= referenceDate;
  });

  return (
    <Card className="@container/card">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6">
          <CardTitle>Youth Participation</CardTitle>
          <CardDescription>
            Number of SK participants per project (based on creation date)
          </CardDescription>
        </div>
        <div className="flex">
          {/* Mobile select */}
          <div className="flex border-t sm:hidden">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger
                className="h-auto rounded-none border-0 bg-transparent px-6 py-5"
                aria-label="Select a value"
              >
                <SelectValue placeholder="Last 30 days" />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Desktop toggle */}
          <div className="hidden items-center gap-2 px-6 sm:flex">
            <ToggleGroup
              type="single"
              value={timeRange}
              onValueChange={(value) => value && setTimeRange(value)}
            >
              <ToggleGroupItem value="7d">7d</ToggleGroupItem>
              <ToggleGroupItem value="30d">30d</ToggleGroupItem>
              <ToggleGroupItem value="90d">90d</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-2 sm:p-6">
        {filteredData.length === 0 ? (
          <div className="flex items-center justify-center h-[250px] text-muted-foreground">
            No participation data available.
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient
                  id="fillParticipants"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--color-participants)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-participants)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      const item = filteredData.find(
                        (i) => i.date === value
                      );
                      return (
                        <>
                          <div>
                            <strong>
                              {new Date(value).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </strong>
                          </div>
                          {item?.title && (
                            <div className="text-xs mt-1">
                              <span className="font-medium">Projects:</span>{" "}
                              {item.title}
                            </div>
                          )}
                        </>
                      );
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="participants"
                type="natural"
                fill="url(#fillParticipants)"
                stroke="var(--color-participants)"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
