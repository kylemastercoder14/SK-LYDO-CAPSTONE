import React from "react";
import StatisticsCard from "@/components/globals/statistics-card";
import db from "@/lib/db";
import {
  calculateMetrics,
  getMonthStartEnd,
  getPreviousMonthStartEnd,
} from "@/lib/utils";
import { ReusableChartAreaInteractive } from "@/components/globals/area-chart";
import { ChartDataPoint, ProposalData } from "@/types/types";
import EventCalendar from "../_components/event-calendar";
import { BudgetPieChart } from "../_components/budget-pie-chart";
import { getServerSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { RecentActivitiesTable } from "../_components/recent-activities-table";

const Page = async () => {
  const user = await getServerSession();

  // If no session exists, redirect to sign-in
  if (!user) {
    redirect("/sign-in");
  }

  // Optional: Verify user role if needed
  if (user.role !== "LYDO") {
    redirect("/unauthorized");
  }

  const now = new Date();
  const { start: currentMonthStart, end: currentMonthEnd } =
    getMonthStartEnd(now);
  const { start: previousMonthStart, end: previousMonthEnd } =
    getPreviousMonthStartEnd(now);

  // Calculate the start date for the last 3 months
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  threeMonthsAgo.setDate(1); // Start from the first day of the month

  // Fetch counts for current and previous month for each report type
  const [
    projectReportsCurrent,
    projectReportsPrevious,
    budgetReportsCurrent,
    budgetReportsPrevious,
    cbydpCurrent,
    cbydpPrevious,
    meetingAgendaCurrent,
    meetingAgendaPrevious,
    // Fetch project proposals for the last 3 months
    projectProposalsData,
  ] = await Promise.all([
    db.projectReports.count({
      where: {
        createdAt: { gte: currentMonthStart, lt: currentMonthEnd },
      },
    }),
    db.projectReports.count({
      where: {
        createdAt: { gte: previousMonthStart, lt: previousMonthEnd },
      },
    }),
    db.budgetReports.count({
      where: {
        createdAt: { gte: currentMonthStart, lt: currentMonthEnd },
      },
    }),
    db.budgetReports.count({
      where: {
        createdAt: { gte: previousMonthStart, lt: previousMonthEnd },
      },
    }),
    db.cBYDP.count({
      where: {
        createdAt: { gte: currentMonthStart, lt: currentMonthEnd },
      },
    }),
    db.cBYDP.count({
      where: {
        createdAt: { gte: previousMonthStart, lt: previousMonthEnd },
      },
    }),
    db.meetingAgenda.count({
      where: {
        createdAt: { gte: currentMonthStart, lt: currentMonthEnd },
      },
    }),
    db.meetingAgenda.count({
      where: {
        createdAt: { gte: previousMonthStart, lt: previousMonthEnd },
      },
    }),
    // Fetch project proposals from the last 3 months
    db.projectProposal.findMany({
      where: {
        createdAt: {
          gte: threeMonthsAgo,
          lte: now,
        },
      },
      select: {
        createdAt: true,
        status: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    }),
  ]);

  const projectReportsMetrics = calculateMetrics(
    projectReportsCurrent,
    projectReportsPrevious,
    "Project Reports"
  );
  const budgetReportsMetrics = calculateMetrics(
    budgetReportsCurrent,
    budgetReportsPrevious,
    "Budget Reports"
  );
  const cbydpMetrics = calculateMetrics(cbydpCurrent, cbydpPrevious, "CBYDP");
  const meetingAgendaMetrics = calculateMetrics(
    meetingAgendaCurrent,
    meetingAgendaPrevious,
    "Meeting Agenda"
  );

  // Process the project proposals data to create chart data
  const processChartData = (proposals: ProposalData[]): ChartDataPoint[] => {
    // Create a map to store daily counts
    const dailyCounts = new Map();

    // Initialize the map with dates for the last 3 months
    const startDate = new Date(threeMonthsAgo);
    const endDate = new Date(now);

    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const dateKey = d.toISOString().split("T")[0];
      dailyCounts.set(dateKey, { approved: 0, rejected: 0 });
    }

    // Count proposals by date and status
    proposals.forEach((proposal: ProposalData) => {
      const dateKey = proposal.createdAt.toISOString().split("T")[0];
      if (dailyCounts.has(dateKey)) {
        const counts = dailyCounts.get(dateKey);
        if (
          proposal.status === "In Progress" ||
          proposal.status === "Completed"
        ) {
          counts.approved += 1;
        } else if (proposal.status === "Rejected") {
          counts.rejected += 1;
        }
      }
    });

    // Convert to chart data format
    return Array.from(dailyCounts.entries()).map(([date, counts]) => ({
      date,
      approved: counts.approved,
      rejected: counts.rejected,
    }));
  };

  const chartData = processChartData(projectProposalsData);

  const chartConfig = {
    proposals: { label: "Proposals" },
    approved: { label: "Approved", color: "var(--primary)" },
    rejected: { label: "Rejected", color: "var(--secondary)" },
  };

  const logs = await db.systemLogs.findMany({
    orderBy: { createdAt: "desc" },
    where: {
      user: {
        // only include logs where the related user is NOT admin
        role: { not: "ADMIN" },
      },
    },
    include: {
      user: true,
    },
  });

  const formattedLogs = logs.map((log) => {
    const displayName = log.user
      ? log.user.firstName || log.user.lastName
        ? `${log.user.firstName ?? ""} ${log.user.lastName ?? ""}`.trim()
        : log.user.username
      : "Unknown User"; // fallback if user is null

    return {
      id: log.id,
      name: displayName,
      action: log.action || "Unknown",
      barangay: log.user?.barangay || "Unknown",
      date: log.createdAt.toLocaleString(),
    };
  });

  const events = await db.events.findMany({});

  const budgetDistribution = await db.budgetDistribution.findMany({
    where: {
      isApproved: true
    },
  });

  return (
    <div className="p-5">
      <div className="grid lg:grid-cols-4 grid-cols-1 gap-5">
        <StatisticsCard title="Project Reports" {...projectReportsMetrics} />
        <StatisticsCard title="Budget Reports" {...budgetReportsMetrics} />
        <StatisticsCard title="CBYDP" {...cbydpMetrics} />
        <StatisticsCard title="Meeting Agenda" {...meetingAgendaMetrics} />
      </div>
      <div className="mt-5">
        <ReusableChartAreaInteractive
          data={chartData}
          config={chartConfig}
          title="Budget & Project Proposals - Approved vs Rejected"
          description="A comparison of approved and rejected project proposals over the last 3 months."
        />
      </div>
      <div className="mt-5 grid lg:grid-cols-5 grid-cols-1 gap-5">
        <div className="lg:col-span-2">
          <EventCalendar events={events} />
        </div>
        <div className="lg:col-span-3 space-y-5">
          <RecentActivitiesTable data={formattedLogs} />
          <BudgetPieChart budgetDistribution={budgetDistribution} />
        </div>
      </div>
    </div>
  );
};

export default Page;
