import React from "react";
import SectionCard from "../_components/section-cards";
import { SKParticipationChart } from "../_components/chart-area-interactive";
import { getDashboardStats } from "@/actions";
import db from "@/lib/db";
import FilterBarangay from "../_components/filter-barangay";
import Heading from "@/components/globals/heading";

const Page = async ({
  searchParams,
}: {
  searchParams: { barangay?: string };
}) => {
  const barangay = searchParams.barangay || null;

  const dashboardStats = await getDashboardStats(barangay ?? undefined);

  const projects = await db.projectProposal.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      isArchived: false,
      user: {
        barangay,
      },
    },
    take: 4,
  });
  const budgetReport = await db.budgetReports.findMany({
    where: {
      isArchived: false,
      user: {
        barangay,
      },
    },
    take: 5,
  });
  const meetingAgenda = await db.meetingAgenda.findMany({
    orderBy: {
      createdAt: "asc",
    },
    where: {
      isArchived: false,
      user: {
        barangay,
      },
    },
    take: 5,
  });
  const skParticipant = await db.projectProposal.findMany({
    where: {
      isArchived: false,
      user: {
        barangay,
      },
    },
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <Heading
          title="Dashboard Analytics"
          description="Here’s What happening on your system. See the statistics at once."
        />
        <FilterBarangay />
      </div>
      <div className="flex mt-5 flex-col gap-4">
        {/* Stats Cards */}
        <div className="grid lg:grid-cols-4 grid-cols-1 gap-5">
          {dashboardStats.map((stat, index) => (
            <SectionCard
              key={index}
              title={stat.title}
              data={stat.data}
              trending={stat.trending as "up" | "down"}
              percentage={stat.percentage}
              description={stat.description}
              recommendation={stat.recommendation}
            />
          ))}
        </div>

        {/* Projects Section */}
        <div className="bg-card p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Ongoing SK Programs</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="border p-4 rounded-lg hover:shadow-md transition-shadow"
              >
                <h3 className="font-medium">{project.title}</h3>
                <p className="text-sm text-muted-foreground">
                  Status:{" "}
                  <span
                    className={
                      project.status === "Completed"
                        ? "text-green-500"
                        : project.status === "In Progress"
                        ? "text-blue-500"
                        : "text-yellow-500"
                    }
                  >
                    {project.status}
                  </span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Date Created: {project.createdAt.toLocaleDateString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  Budget: ₱{project.budget.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Budget and Meetings Side by Side */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Budget Report Section */}
          <div className="bg-card p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">SK Budget Report</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-card">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Allocated
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Spent
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Remaining
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-gray-200">
                  {budgetReport.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        {item.name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {item.allocated}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {item.spent}
                      </td>
                      <td
                        className={`px-4 py-3 whitespace-nowrap text-sm ${
                          item.allocated! - item.spent! < 0
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                      >
                        {(item.allocated ?? 0) - (item.spent ?? 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Meeting Agenda Section */}
          <div className="bg-card p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">SK Schedules</h2>
            <div className="space-y-4">
              {meetingAgenda.map((meeting) => (
                <div
                  key={meeting.id}
                  className="border-l-4 border-blue-500 pl-4 py-3 rounded transition-colors"
                >
                  <h3 className="font-medium">{meeting.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>
                      {meeting.createdAt.toLocaleDateString()} at{" "}
                      {meeting.createdAt.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>{meeting.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <SKParticipationChart skParticipant={skParticipant} />
      </div>
    </div>
  );
};

export default Page;
