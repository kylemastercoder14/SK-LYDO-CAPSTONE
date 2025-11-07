import React from "react";
import db from "@/lib/db";
import Heading from "@/components/globals/heading";
import FileBrowser from "./file-browser";

const Page = async (props: { params: Promise<{ year: string }> }) => {
  const { year } = await props.params;

  // 👉 Filter by year from createdAt
  const data = await db.aBYIP.findMany({
    where: {
      createdAt: {
        gte: new Date(`${year}-01-01`),
        lte: new Date(`${year}-12-31`),
      },
      isArchived: false,
    },
    include: {
      user: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const formatted = data.map((d) => ({
    ...d,
    barangay: d.user?.barangay ?? "Unknown",
  }));

  return (
    <div className="p-5">
      <Heading
        title={`ABYIP Files - ${year}`}
        description="View and manage ABYIP uploaded files."
      />

      <div className="mt-5">
        <FileBrowser files={formatted} />
      </div>
    </div>
  );
};

export default Page;
