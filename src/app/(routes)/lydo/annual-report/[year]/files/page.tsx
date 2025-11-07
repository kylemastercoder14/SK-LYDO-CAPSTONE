import React from "react";
import db from "@/lib/db";
import Heading from "@/components/globals/heading";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import FileList from "./_components/file-list";

const AnnualReportPage = async (props: {
  params: Promise<{ year: string }>;
}) => {
  const params = await props.params;

  const start = new Date(`${params.year}-01-01`);
  const end = new Date(`${params.year}-12-31`);

  const queries = [
    db.budgetReports.findMany({
      where: { createdAt: { gte: start, lte: end } },
      include: { user: true },
    }),
    db.cBYDP.findMany({
      where: { createdAt: { gte: start, lte: end } },
      include: { user: true },
    }),
    db.meetingMinutes.findMany({
      where: { createdAt: { gte: start, lte: end } },
      include: { user: true },
    }),
    db.meetingMinutes.findMany({
      where: { createdAt: { gte: start, lte: end } },
      include: { user: true },
    }),
    db.projectReports.findMany({
      where: { createdAt: { gte: start, lte: end } },
      include: { user: true },
    }),
    db.projectProposal.findMany({
      where: {
        createdAt: { gte: start, lte: end },
        status: { in: ["In Progress", "Completed"] },
      },
      include: { user: true },
    }),
  ];

  const [
    budgetReports,
    cbydp,
    meetingMinutes,
    otherMinutes,
    projectReports,
    projectProposals,
  ] = await Promise.all(queries);

  const reports = [
    ...budgetReports.map((r) => ({ ...r, source: "budgetReports" })),
    ...cbydp.map((r) => ({ ...r, source: "cBYDP" })),
    ...meetingMinutes.map((r) => ({ ...r, source: "meetingMinutes" })),
    ...otherMinutes.map((r) => ({ ...r, source: "otherMinutes" })),
    ...projectReports.map((r) => ({ ...r, source: "projectReports" })),
    ...projectProposals.map((r) => ({ ...r, source: "projectProposals" })),
  ].map((r) => ({
    ...r,
    barangay: r.user?.barangay ?? "Unknown",
  }));

  return (
    <div className="p-5">
      <Heading
        title={`Annual Report for ${params.year}`}
        description={`Annual Report for ${params.year} for all barangay registered.`}
      />

      <div className="mt-5">
        <FileList reports={reports} />
      </div>
    </div>
  );
};

export default AnnualReportPage;
