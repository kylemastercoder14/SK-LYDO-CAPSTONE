import React from "react";
import db from "@/lib/db";
import Heading from "@/components/globals/heading";
import FileBrowser from "./file-browser";
import { getServerSession } from '@/lib/session';

const Page = async (props: { params: Promise<{ year: string }> }) => {
  const { year } = await props.params;
  const user = await getServerSession();

  // 👉 Filter by year from createdAt
  const data = await db.cBYDP.findMany({
    where: {
      createdAt: {
        gte: new Date(`${year}-01-01`),
        lte: new Date(`${year}-12-31`),
      },
      isArchived: false,
      user: {
        barangay: user?.barangay,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-5">
      <Heading
        title={`CBYPD Files - ${year}`}
        description="View and manage CBYPD uploaded files."
      />

      <div className="mt-5">
        <FileBrowser userRole={user?.officialType as string} files={data} />
      </div>
    </div>
  );
};

export default Page;
