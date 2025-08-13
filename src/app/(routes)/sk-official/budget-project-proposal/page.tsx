import React from "react";
import Heading from "@/components/globals/heading";
import { DataTable } from "./_components/data-table";
import db from "@/lib/db";
import { columns } from "./_components/columns";
import ProjectProposalModal from "./_components/project-proposal-modal";
import { getServerSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Page = async () => {
  const user = await getServerSession();
  const data = await db.projectProposal.findMany({
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
          title="Budget & Project Proposals"
          description="View and manage budget & project proposals for your barangay."
        />
        <ProjectProposalModal userId={user?.id} />
      </div>
      <div className="mt-5">
        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending">Pending Proposal</TabsTrigger>
            <TabsTrigger value="approved">Approved Proposal</TabsTrigger>
            <TabsTrigger value="rejected">Rejected Proposal</TabsTrigger>
            <TabsTrigger value="inactive">Inactive Proposal</TabsTrigger>
          </TabsList>
          <TabsContent value="approved">
            <DataTable
              columns={columns}
              data={data.filter((report) => report.status === "Approved")}
            />
          </TabsContent>
          <TabsContent value="pending">
            <DataTable
              columns={columns}
              data={data.filter((report) => report.status === "Pending")}
            />
          </TabsContent>
          <TabsContent value="rejected">
            <DataTable
              columns={columns}
              data={data.filter((report) => report.status === "Rejected")}
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
