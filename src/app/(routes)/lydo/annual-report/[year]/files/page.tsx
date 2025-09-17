import React from "react";
import db from "@/lib/db";
import Heading from "@/components/globals/heading";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import FileCard from './_components/file-card';

const AnnualReportPage = async (props: {
  params: Promise<{
    year: string;
  }>;
}) => {
  const params = await props.params;

  // Define date range
  const start = new Date(`${params.year}-01-01`);
  const end = new Date(`${params.year}-12-31`);

  // Fetch all reports
  const [
    budgetReports,
    cbydp,
    meetingMinutes,
    otherMinutes,
    projectReports,
    projectProposals,
  ] = await Promise.all([
    db.budgetReports.findMany({
      where: { createdAt: { gte: start, lte: end } },
    }),
    db.cBYDP.findMany({ where: { createdAt: { gte: start, lte: end } } }),
    db.meetingMinutes.findMany({
      where: { createdAt: { gte: start, lte: end } },
    }),
    db.meetingMinutes.findMany({
      where: { createdAt: { gte: start, lte: end } },
    }),
    db.projectReports.findMany({
      where: { createdAt: { gte: start, lte: end } },
    }),
    db.projectProposal.findMany({
      where: {
        createdAt: { gte: start, lte: end },
        status: { in: ["In Progress", "Completed"] },
      },
    }),
  ]);

  // Merge into one array with a type label
  const reports = [
    ...budgetReports.map((r) => ({ ...r, source: "budgetReports" })),
    ...cbydp.map((r) => ({ ...r, source: "cBYDP" })),
    ...meetingMinutes.map((r) => ({ ...r, source: "meetingMinutes" })),
    ...otherMinutes.map((r) => ({ ...r, source: "otherMinutes" })),
    ...projectReports.map((r) => ({ ...r, source: "projectReports" })),
    ...projectProposals.map((r) => ({ ...r, source: "projectProposals" })),
  ];

  return (
    <div className="p-5">
      <Heading
        title={`Annual Report for ${params.year}`}
        description={`Annual Report for ${params.year} for all barangay registered.`}
      />
      <div className="mt-5">
        <div className="grid lg:grid-cols-6 grid-cols-1 gap-5">
          {reports.map((report) => (
            <FileCard key={`${report.source}-${report.id}`} report={report} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnnualReportPage;
