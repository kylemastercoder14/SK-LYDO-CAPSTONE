import React from "react";
import Heading from "@/components/globals/heading";
import { DataTable } from "./_components/data-table";
import db from "@/lib/db";
import { columns } from "./_components/columns";

const Page = async () => {
  const data = await db.projectProposal.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      status: {
        in: ["In Progress", "Completed"],
      },
    },
    include: {
      user: true,
    },
  });

  return (
    <div className="p-5">
      <div className="flex items-center justify-between">
        <Heading
          title="Approved Budget & Project Proposals"
          description="View and manage approved budget & project proposals for your system."
        />
      </div>
      <div className="mt-5">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export default Page;
