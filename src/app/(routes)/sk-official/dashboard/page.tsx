import React from "react";
import StatisticsCard from "@/components/globals/statistics-card";
import db from "@/lib/db";
import { calculateMetrics } from "@/lib/utils";
import { ReusableChartAreaInteractive } from "@/components/globals/area-chart";
import { ChartDataPoint, ProposalData } from "@/types/types";
import EventCalendar from "../_components/event-calendar";
import { OfficialsTable } from "../_components/officials-table";
import { BudgetPieChart } from "../_components/budget-pie-chart";
import { getServerSession } from "@/lib/session";
import { redirect } from "next/navigation";
import Image from "next/image";

const Page = async () => {
  const user = await getServerSession();

  // If no session exists, redirect to sign-in
  if (!user) {
    redirect("/sign-in");
  }

  // Optional: Verify user role if needed
  if (user.role !== "SK_OFFICIAL") {
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
    projectProposalsData,
  ] = await Promise.all([
    db.projectReports.count(),
    db.projectReports.count(),
    db.budgetReports.count(),
    db.budgetReports.count(),
    db.cBYDP.count(),
    db.cBYDP.count(),
    db.meetingAgenda.count(),
    db.meetingAgenda.count(),
    db.projectProposal.findMany({
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

  const officialsTable = await db.user.findMany({
    where: {
      barangay: user.barangay as string,
      role: {
        notIn: ["ADMIN", "LYDO", "SK_FEDERATION"],
      },
    },
  });

  const formattedOfficials = officialsTable.map((official) => {
    const displayName =
      official.firstName || official.lastName
        ? `${official.firstName ?? ""} ${official.lastName ?? ""}`.trim()
        : official.username; // fallback if no first/last name
    return {
      id: official.id,
      name: displayName,
      position: official.officialType || "Unknown",
      committee: official.committee,
    };
  });

  const events = await db.events.findMany({
    where: {
      barangay: user.barangay as string,
    },
  });

  const budgetDistribution = await db.budgetDistribution.findMany({
    where: {
      barangay: user.barangay as string,
      isApproved: true,
    },
  });

  const barangayBanner = await db.assets.findFirst({
    where: {
      barangay: user.barangay as string,
    },
  });

  return (
    <div className="p-5">
      <div className="grid lg:grid-cols-5 grid-cols-1 gap-5 mb-5">
        {barangayBanner?.barangayBanner && (
          <div className="relative lg:col-span-2 w-full aspect-video rounded-md h-[450px]">
            <Image
              src={barangayBanner?.barangayBanner}
              alt="Barangay banner"
              fill
              className="object-contain rounded-md"
            />
          </div>
        )}
        <div className={barangayBanner?.barangayBanner ? "lg:col-span-3" : "lg:col-span-5"}>
          <OfficialsTable data={formattedOfficials} userRole={user.officialType || ""} />
        </div>
      </div>
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
          <BudgetPieChart budgetDistribution={budgetDistribution} />
        </div>
      </div>
    </div>
  );
};

export default Page;
