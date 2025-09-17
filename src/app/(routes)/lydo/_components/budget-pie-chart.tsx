/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { LabelList, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from "@/components/ui/chart";
import { BudgetDistribution } from "@prisma/client";

// 🎨 Assign fixed colors per committee (same as before)
const chartConfig: ChartConfig & {
  [key: string]: { label: string; color?: string };
} = {
  Health: { label: "Health", color: "#1f77b6" },
  Education: { label: "Education", color: "#fe9900" },
  "Economic Empowerment": { label: "Economic Empowerment", color: "#2ba02d" },
  "Social Inclusion & Equity": { label: "Social Inclusion & Equity", color: "#f5cf46" },
  "Peace & Security": { label: "Peace & Security", color: "#e54b4a" },
  Environment: { label: "Environment", color: "#354a5f" },
  Governance: { label: "Governance", color: "#9866bd" },
  "Active Citizenship": { label: "Active Citizenship", color: "#8c564c" },
  "Other MOOE": { label: "Other MOOE", color: "#0199cb" },
};

// ✅ Custom Tooltip with currency + percentage
const CustomTooltip = ({ active, payload, total }: any) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  const percent = ((data.amount / total) * 100).toFixed(1);

  return (
    <div className="rounded-md border bg-background p-2 shadow-sm">
      <p className="text-sm font-medium">{data.committee}</p>
      <p className="text-sm text-muted-foreground">
        ₱{data.amount.toLocaleString()} ({percent}%)
      </p>
    </div>
  );
};

export function BudgetPieChart({
  budgetDistribution,
}: {
  budgetDistribution: BudgetDistribution[];
}) {
  const currentYear = new Date().getFullYear().toString();

  // 🔄 Transform DB data → chartData
  const chartData = budgetDistribution
    .filter((b) => b.isApproved && b.year === currentYear)
    .map((b) => ({
      committee: b.allocated,
      amount: b.spent,
      fill: chartConfig[b.allocated]?.color ?? "#ccc", // fallback color
    }));

  const total = chartData.reduce((sum, entry) => sum + entry.amount, 0);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Budget Distribution {currentYear}</CardTitle>
        <CardDescription>
          Showing fund allocation per committee annually.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-pie-label-text]:fill-foreground mx-auto w-full aspect-square max-h-[350px] pb-0"
        >
          <PieChart>
            <ChartTooltip content={<CustomTooltip total={total} />} />
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="committee"
              label={({ value }) =>
                value != null ? `₱${value.toLocaleString()}` : ""
              }
            />
            <LabelList
              dataKey="committee"
              className="fill-background"
              stroke="none"
              fontSize={12}
              formatter={(label) =>
                typeof label === "string"
                  ? chartConfig[label]?.label ?? label
                  : label
              }
            />

            <ChartLegend
              content={<ChartLegendContent nameKey="committee" />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 mt-5 *:justify-start"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
