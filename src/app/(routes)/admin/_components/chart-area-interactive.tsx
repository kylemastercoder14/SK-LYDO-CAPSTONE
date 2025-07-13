"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export const description = "SK Program Participation Trends";

// Modified data to reflect SK activities
const chartData = [
  { date: "2024-04-01", events: 45, trainings: 30 },
  { date: "2024-04-02", events: 32, trainings: 28 },
  { date: "2024-04-03", events: 56, trainings: 42 },
  { date: "2024-04-04", events: 68, trainings: 55 },
  { date: "2024-04-05", events: 72, trainings: 60 },
  { date: "2024-04-06", events: 85, trainings: 48 },
  { date: "2024-04-07", events: 42, trainings: 35 },
  { date: "2024-04-08", events: 78, trainings: 62 },
  { date: "2024-04-09", events: 25, trainings: 40 },
  { date: "2024-04-10", events: 60, trainings: 45 },
  { date: "2024-04-11", events: 75, trainings: 58 },
  { date: "2024-04-12", events: 62, trainings: 50 },
  { date: "2024-04-13", events: 88, trainings: 65 },
  { date: "2024-04-14", events: 40, trainings: 32 },
  { date: "2024-04-15", events: 35, trainings: 28 },
  { date: "2024-04-16", events: 48, trainings: 36 },
  { date: "2024-04-17", events: 92, trainings: 70 },
  { date: "2024-04-18", events: 76, trainings: 64 },
  { date: "2024-04-19", events: 58, trainings: 45 },
  { date: "2024-04-20", events: 30, trainings: 38 },
  { date: "2024-04-21", events: 42, trainings: 40 },
  { date: "2024-04-22", events: 55, trainings: 42 },
  { date: "2024-04-23", events: 48, trainings: 50 },
  { date: "2024-04-24", events: 80, trainings: 58 },
  { date: "2024-04-25", events: 52, trainings: 45 },
  { date: "2024-04-26", events: 28, trainings: 32 },
  { date: "2024-04-27", events: 85, trainings: 72 },
  { date: "2024-04-28", events: 38, trainings: 40 },
  { date: "2024-04-29", events: 65, trainings: 50 },
  { date: "2024-04-30", events: 90, trainings: 68 },
  // ... additional months would continue similarly
];

const chartConfig = {
  events: {
    label: "Community Events",
    color: "var(--primary)",
  },
  trainings: {
    label: "Youth Trainings",
    color: "var(--secondary)",
  },
} satisfies ChartConfig;

export function SKParticipationChart() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("30d");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-04-30");
    let daysToSubtract = 30;
    if (timeRange === "90d") {
      daysToSubtract = 90;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Youth Participation</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Participation in SK programs and activities
          </span>
          <span className="@[540px]/card:hidden">Program participation</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select time range"
            >
              <SelectValue placeholder="Last 30 days" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillEvents" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-events)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-events)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillTrainings" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-trainings)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-trainings)"
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
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 10}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="events"
              type="natural"
              fill="url(#fillEvents)"
              stroke="var(--color-events)"
              stackId="a"
            />
            <Area
              dataKey="trainings"
              type="natural"
              fill="url(#fillTrainings)"
              stroke="var(--color-trainings)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
