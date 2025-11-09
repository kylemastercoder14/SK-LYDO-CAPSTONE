import React from "react";
import db from "@/lib/db";
import Heading from "@/components/globals/heading";
import FileBrowser from "./file-browser";
import { getServerSession } from '@/lib/session';

const Page = async (props: { params: Promise<{ year: string }> }) => {
  const { year } = await props.params;
  const user = await getServerSession();

  // 👉 Filter by year from createdAt
  const data = await db.aBYIP.findMany({
    where: {
      createdAt: {
        gte: new Date(`${year}-01-01`),
        lte: new Date(`${year}-12-31`),
      },
      isArchived: false,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-5">
      <Heading
        title={`ABYIP Files - ${year}`}
        description="View and manage ABYIP uploaded files."
      />

      <div className="mt-5">
        <FileBrowser files={data} userRole={user?.officialType as string} />
      </div>
    </div>
  );
};

export default Page;
