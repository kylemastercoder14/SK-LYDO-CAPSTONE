import React from "react";
import Heading from "@/components/globals/heading";
import db from "@/lib/db";
import EventModal from "./_components/event-modal";
import { getServerSession } from "@/lib/session";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "./_components/data-table";
import { columns } from './_components/columns';

const Page = async () => {
  const user = await getServerSession();
  const data = await db.events.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      barangay: user?.barangay as string,
    },
  });

  return (
    <div className="p-5">
      <div className="flex items-center justify-between">
        <Heading
          title="Events and Activities"
          description="View and manage events and activities for your barangay."
        />
        <EventModal barangay={user?.barangay as string} />
      </div>
      <div className="mt-5">
        <Tabs defaultValue="upcoming">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
            <TabsTrigger value="ongoing">Ongoing Events</TabsTrigger>
            <TabsTrigger value="past">Past Events</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming">
            <DataTable
              columns={columns}
              data={data.filter(
                (event) => new Date(event.startDate) > new Date()
              )}
            />
          </TabsContent>
          <TabsContent value="ongoing">
            <DataTable
              columns={columns}
              data={data.filter(
                (event) =>
                  new Date(event.startDate) <= new Date() &&
                  new Date(event.endDate) >= new Date()
              )}
            />
          </TabsContent>
          <TabsContent value="past">
            <DataTable
              columns={columns}
              data={data.filter(
                (event) => new Date(event.endDate) < new Date()
              )}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Page;
