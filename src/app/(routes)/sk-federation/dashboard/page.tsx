/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import StatisticsCard from "@/components/globals/statistics-card";
import db from "@/lib/db";
import { calculateMetrics } from "@/lib/utils";
import { ReusableChartAreaInteractive } from "@/components/globals/area-chart";
import { ChartDataPoint, ProposalData } from "@/types/types";
import EventCalendar from "../_components/event-calendar";
import { BudgetPieChart } from "../_components/budget-pie-chart";
import { getServerSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { RecentActivitiesTable } from "../_components/recent-activities-table";
import Heading from "@/components/globals/heading";
import FilterBarangay from "../_components/filter-barangay";

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ barangay?: string }>;
}) => {
  const { barangay } = await searchParams;

  const user = await getServerSession();

  // If no session exists, redirect to sign-in
  if (!user) {
    redirect("/sign-in");
  }

  // Optional: Verify user role if needed
  if (user.role !== "SK_FEDERATION") {
    redirect("/unauthorized");
  }

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
        user: {
          barangay,
        },
      },
    }),
    db.projectReports.count({
      where: {
        user: {
          barangay,
        },
      },
    }),
    db.budgetReports.count({
      where: {
        user: {
          barangay,
        },
      },
    }),
    db.budgetReports.count({
      where: {
        user: {
          barangay,
        },
      },
    }),
    db.cBYDP.count({
      where: {
        user: {
          barangay,
        },
      },
    }),
    db.cBYDP.count({
      where: {
        user: {
          barangay,
        },
      },
    }),
    db.meetingAgenda.count({
      where: {
        user: {
          barangay,
        },
      },
    }),
    db.meetingAgenda.count({
      where: {
        user: {
          barangay,
        },
      },
    }),

    db.projectProposal.findMany({
      where: {
        user: {
          barangay,
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
    // Create a map to count approved/rejected proposals per day
    const dailyCounts = new Map<
      string,
      { approved: number; rejected: number }
    >();

    // Loop through all proposals
    proposals.forEach((proposal) => {
      const dateKey = proposal.createdAt.toISOString().split("T")[0];

      if (!dailyCounts.has(dateKey)) {
        dailyCounts.set(dateKey, { approved: 0, rejected: 0 });
      }

      const counts = dailyCounts.get(dateKey)!;
      if (
        proposal.status === "In Progress" ||
        proposal.status === "Completed"
      ) {
        counts.approved += 1;
      } else if (proposal.status === "Rejected") {
        counts.rejected += 1;
      }
    });

    // Convert to sorted array (chronological order)
    return Array.from(dailyCounts.entries())
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .map(([date, counts]) => ({
        date,
        approved: counts.approved,
        rejected: counts.rejected,
      }));
  };

  const chartData = processChartData(projectProposalsData);

  const chartConfig = {
    proposals: { label: "Proposals" },
    approved: { label: "Approved", color: "#198754" },
    rejected: { label: "Rejected", color: "var(--destructive)" },
  };

  const logs = await db.systemLogs.findMany({
    orderBy: { createdAt: "desc" },
    where: {
      user: {
        barangay,
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

  let events: any[] = [];

  if (barangay) {
    events = await db.events.findMany({
      where: {
        barangay: barangay || "",
      },
    });
  } else {
    events = await db.events.findMany();
  }

  let budgetDistribution: any[] = [];

  if (barangay) {
    // Barangay selected → show only that barangay
    budgetDistribution = await db.budgetDistribution.findMany({
      where: {
        barangay,
        isApproved: true,
      },
    });
  } else {
    // No barangay selected → sum all barangays’ budget per committee
    const allData = await db.budgetDistribution.findMany({
      where: { isApproved: true },
    });

    // Group by committee and sum "spent"
    const committeeTotals = allData.reduce<
      Record<string, { spent: number; year: string }>
    >((acc, item) => {
      if (!acc[item.allocated]) {
        acc[item.allocated] = { spent: 0, year: item.year };
      }
      acc[item.allocated].spent += item.spent;
      return acc;
    }, {});

    // Convert grouped result into array (same shape as budgetDistribution)
    budgetDistribution = Object.entries(committeeTotals).map(
      ([allocated, data]) => ({
        allocated,
        spent: data.spent,
        year: data.year,
        isApproved: true,
      })
    );
  }

  return (
    <div className="p-5">
      <div className="flex items-center justify-between">
        <Heading
          title="Dashboard Analytics"
          description="Here’s What happening on your system. See the statistics at once."
        />
        <FilterBarangay />
      </div>
      <div className="grid mt-5 lg:grid-cols-4 grid-cols-1 gap-5">
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
