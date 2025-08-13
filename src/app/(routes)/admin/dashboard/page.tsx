import React from "react";
import SectionCard from "../_components/section-cards";
import { SKParticipationChart } from '../_components/chart-area-interactive';

const Page = () => {
  // Static data for dashboard cards - SK Federation specific
  const dashboardStats = [
    {
      title: "Total SK Members",
      data: 142,
      trending: "up",
      percentage: "+12.5%",
      description: "Registered youth members in the SK Federation",
      recommendation: "Conduct barangay outreach to register more youth members",
    },
    {
      title: "Active Programs",
      data: 8,
      trending: "up",
      percentage: "+15%",
      description: "Ongoing youth development programs",
      recommendation: "Evaluate program effectiveness and participant feedback",
    },
    {
      title: "Budget Utilization",
      data: "65%",
      trending: "down",
      percentage: "-10%",
      description: "Percentage of SK funds currently utilized",
      recommendation: "Review pending project proposals for fund allocation",
    },
    {
      title: "Upcoming Events",
      data: 5,
      trending: "up",
      percentage: "+25%",
      description: "Scheduled community events and activities",
      recommendation: "Assign committees for event preparation",
    },
  ];

  // Static data for projects - SK specific
  const projects = [
    {
      id: 1,
      name: "Youth Sports League",
      status: "In Progress",
      deadline: "2023-12-15",
      budget: "₱45,000",
    },
    {
      id: 2,
      name: "Leadership Training",
      status: "Planning",
      deadline: "2024-02-28",
      budget: "₱78,500",
    },
    {
      id: 3,
      name: "Community Clean-up",
      status: "Completed",
      deadline: "2023-11-10",
      budget: "₱32,000",
    },
    {
      id: 4,
      name: "Scholarship Program",
      status: "In Progress",
      deadline: "2023-12-31",
      budget: "₱55,000",
    },
  ];

  // Static data for budget report - SK specific categories
  const budgetReport = [
    {
      category: "Youth Programs",
      allocated: "₱150,000",
      spent: "₱95,000",
      remaining: "₱55,000",
    },
    {
      category: "Community Projects",
      allocated: "₱100,000",
      spent: "₱62,000",
      remaining: "₱38,000",
    },
    {
      category: "Office Operations",
      allocated: "₱50,000",
      spent: "₱55,000",
      remaining: "-₱5,000",
    },
    {
      category: "Training & Seminars",
      allocated: "₱80,000",
      spent: "₱38,000",
      remaining: "₱42,000",
    },
  ];

  // Static data for meeting agenda - SK specific meetings
  const meetingAgenda = [
    {
      id: 1,
      title: "Monthly SK Assembly",
      date: "2023-11-15",
      time: "10:00 AM",
      location: "Barangay Hall",
    },
    {
      id: 2,
      title: "Budget Committee Meeting",
      date: "2023-11-20",
      time: "2:00 PM",
      location: "SK Office",
    },
  ];

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4">
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
              <div key={project.id} className="border p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-medium">{project.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Status: <span className={project.status === "Completed" ? "text-green-500" :
                                         project.status === "In Progress" ? "text-blue-500" :
                                         "text-yellow-500"}>{project.status}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Deadline: {project.deadline}
                </p>
                <p className="text-sm text-muted-foreground">
                  Budget: {project.budget}
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
                        {item.category}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {item.allocated}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {item.spent}
                      </td>
                      <td
                        className={`px-4 py-3 whitespace-nowrap text-sm ${
                          item.remaining.startsWith("-")
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                      >
                        {item.remaining}
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
                  <h3 className="font-medium">{meeting.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{meeting.date} at {meeting.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{meeting.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

         <SKParticipationChart />
      </div>
    </div>
  );
};

export default Page;
