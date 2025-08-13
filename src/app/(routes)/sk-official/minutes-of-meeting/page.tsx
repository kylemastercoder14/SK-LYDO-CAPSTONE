import React from "react";
import Heading from "@/components/globals/heading";
import { DataTable } from "./_components/data-table";
import db from "@/lib/db";
import { columns } from "./_components/columns";
import MinutesMeetingModal from "./_components/minutes-meeting-modal";
import { getServerSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Page = async () => {
  const user = await getServerSession();
  const data = await db.meetingMinutes.findMany({
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

  if (!user) {
    toast.loading("Logging out due to inactivity...");
    redirect("/sign-in");
  }

  return (
    <div className="p-5">
      <div className="flex items-center justify-between">
        <Heading
          title="Minutes of Meeting"
          description="View and manage minutes of meeting for your barangay."
        />
        <MinutesMeetingModal userId={user?.id} />
      </div>
      <div className="mt-5">
        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">Active Minutes of Meeting</TabsTrigger>
            <TabsTrigger value="inactive">
              Inactive Minutes of Meeting
            </TabsTrigger>
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
