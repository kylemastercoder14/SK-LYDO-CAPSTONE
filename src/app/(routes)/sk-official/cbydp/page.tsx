/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Heading from "@/components/globals/heading";
import db from "@/lib/db";
import CBYDPReportModal from "./_components/cbydp-report-modal";
import { getServerSession } from "@/lib/session";
import FolderView from './_components/folder-view';

const Page = async () => {
  const user = await getServerSession();
  const reports = await db.cBYDP.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      user: {
        barangay: user?.barangay,
      },
    },
    include: {
      user: true,
    },
  });

  // Group by year
  const grouped = reports.reduce((acc: any, item) => {
    const year = new Date(item.createdAt).getFullYear();
    acc[year] = acc[year] || [];
    acc[year].push(item);
    return acc;
  }, {});

  return (
    <div className="p-5">
      <div className="flex items-center justify-between">
        <Heading
          title="CBYDP Report"
          description="View and manage CBYDP reports for your barangay."
        />
        {user?.officialType === "SECRETARY" && (
          <CBYDPReportModal userId={user?.id ?? ""} />
        )}
      </div>
      <div className="mt-5">
        <FolderView grouped={grouped} />
      </div>
    </div>
  );
};

export default Page;
