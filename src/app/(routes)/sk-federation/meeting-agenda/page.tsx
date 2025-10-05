import React from "react";
import Heading from "@/components/globals/heading";
import { DataTable } from "./_components/data-table";
import db from "@/lib/db";
import { columns } from "./_components/columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Page = async () => {
  const data = await db.meetingAgenda.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true,
    },
  });

  return (
    <div className="p-5">
      <div className="flex items-center justify-between">
        <Heading
          title="Meeting Agenda"
          description="View and manage meeting agendas for your system."
        />
      </div>
      <div className="mt-5">
        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">Active Meeting Agenda</TabsTrigger>
            <TabsTrigger value="inactive">Inactive Meeting Agenda</TabsTrigger>
          </TabsList>
          <TabsContent value="active">
            <DataTable
              columns={columns}
              data={data.filter((report) => !report.isArchived)}
            />
          </TabsContent>
          <TabsContent value="inactive">
            <DataTable
              columns={columns}
              data={data.filter((report) => report.isArchived)}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Page;
