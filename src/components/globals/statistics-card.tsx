import React from "react";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const StatisticsCard = ({
  title,
  data,
  percentage,
  description,
  recommendation,
  previousData,
  trend,
}: {
  title: string;
  data: string;
  percentage: string;
  description: string;
  recommendation: string;
  previousData: string;
  trend: "up" | "down" | "stable";
}) => {
  const renderTrendIcon = () => {
    if (trend === "up") {
      return <IconTrendingUp />;
    } else if (trend === "down") {
      return <IconTrendingDown />;
    }
    // No icon for "stable" trend
    return null;
  };
  return (
    <Card>
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {data}{" "}
          <span className='text-sm font-normal text-muted-foreground'>vs {previousData} (last month)</span>
        </CardTitle>
        <CardAction>
          <Badge variant="outline">
            {renderTrendIcon()}
            {percentage}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          {description} {renderTrendIcon()}
        </div>
        <div className="text-muted-foreground">{recommendation}</div>
      </CardFooter>
    </Card>
  );
};

export default StatisticsCard;
