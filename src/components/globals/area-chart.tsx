/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

// This is a simple mock hook, replace with your actual implementation.
const useIsMobile = () => {
    const [isMobile, setIsMobile] = React.useState(false);
    React.useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return isMobile;
};

// Define the shape of the data and props to ensure type safety and clarity.
interface ChartDataPoint {
  [key: string]: any;
}

interface ChartProps {
  data: ChartDataPoint[];
  config: ChartConfig;
  title: string;
  description: string;
  dateKey?: string;
  referenceDate?: string;
  timeRanges?: { label: string; value: string; days: number }[];
}

export const ReusableChartAreaInteractive = ({
  data,
  config,
  title,
  description,
  dateKey = "date",
  referenceDate,
  timeRanges = [
    { label: "Last 3 months", value: "90d", days: 90 },
    { label: "Last 30 days", value: "30d", days: 30 },
    { label: "Last 7 days", value: "7d", days: 7 },
  ],
}: ChartProps) => {
  const isMobile = useIsMobile()
  const defaultTimeRange = isMobile ? "7d" : "90d";
  const [timeRange, setTimeRange] = React.useState(defaultTimeRange)

  // Use useEffect to update the timeRange when the mobile state changes
  React.useEffect(() => {
    setTimeRange(isMobile ? "7d" : "90d");
  }, [isMobile]);

  // Determine the reference date for filtering, defaulting to the last date in the data or the current date.
  const refDate = referenceDate ? new Date(referenceDate) : (data.length > 0 ? new Date(data[data.length - 1][dateKey]) : new Date());

  // Filter the data based on the selected time range.
  const filteredData = data.filter((item) => {
    const date = new Date(item[dateKey])
    const selectedRange = timeRanges.find(range => range.value === timeRange);
    if (!selectedRange) return true; // Default to showing all data if range is not found

    const daysToSubtract = selectedRange.days;
    const startDate = new Date(refDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  })

  // Get the keys from the config to render the Area components dynamically.
  // We filter out the 'visitors' key which is a label and not a data key.
  const dataKeys = Object.keys(config).filter(key => key !== 'visitors');

  // A helper function to create a gradient for a given data key.
  const renderGradient = (key: string) => {
    const color = (config[key]?.color as string) || "var(--primary)";
    const opacity = (config[key]?.color as string) === "var(--primary)" ? "0.1" : "0.8";

    return (
        <linearGradient key={`gradient-${key}`} id={`fill${key}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.8} />
            <stop offset="95%" stopColor={color} stopOpacity={opacity} />
        </linearGradient>
    );
  };

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            {description}
          </span>
          <span className="@[540px]/card:hidden">
            {timeRanges.find(r => r.value === timeRange)?.label}
          </span>
        </CardDescription>
        <CardAction>
          {/* Toggle group for larger screens */}
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            {timeRanges.map(range => (
              <ToggleGroupItem key={range.value} value={range.value}>
                {range.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          {/* Select dropdown for smaller screens */}
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder={timeRanges.find(r => r.value === timeRange)?.label || "Select a range"} />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {timeRanges.map(range => (
                <SelectItem key={range.value} value={range.value} className="rounded-lg">
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={config}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              {dataKeys.map(key => renderGradient(key))}
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={dateKey}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            {/* Dynamically render Area components based on the config keys */}
            {dataKeys.map((key) => (
              <Area
                key={key}
                dataKey={key}
                type="natural"
                fill={`url(#fill${key})`}
                stroke={(config[key]?.color as string) || "var(--primary)"}
                stackId="a" // Stack all areas
              />
            ))}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

