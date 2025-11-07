/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Heading from "@/components/globals/heading";
import db from "@/lib/db";
import FolderView from "./_components/folder-view";

const Page = async () => {
  const reports = await db.aBYIP.findMany({
    orderBy: { createdAt: "desc" },
    where: {
      isArchived: false
    },
    include: { user: true },
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
          title="ABYIP Report"
          description="View and manage ABYIP reports for your system."
        />
      </div>

      <div className="mt-5">
        <FolderView grouped={grouped} />
      </div>
    </div>
  );
};

export default Page;
