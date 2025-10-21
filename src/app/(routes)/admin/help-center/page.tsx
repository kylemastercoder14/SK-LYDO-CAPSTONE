
import React from "react";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import db from "@/lib/db";

const Page = async () => {
  const data = await db.ticket.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true
    }
  });
  return (
    <div className="p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Manage Submitted Tickets</h3>
      </div>
      <div className="mt-5">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export default Page;
