import React from "react";
import Heading from "@/components/globals/heading";
import { DataTable } from "./_components/data-table";
import db from "@/lib/db";
import { columns } from "./_components/columns";
import CBYDPReportModal from "./_components/cbydp-report-modal";
import { getServerSession } from "@/lib/session";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Page = async () => {
  const user = await getServerSession();
  const data = await db.cBYDP.findMany({
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

  return (
	<div className="p-5">
	  <div className="flex items-center justify-between">
		<Heading
		  title="CBYDP Report"
		  description="View and manage CBYDP reports for your barangay."
		/>
		<CBYDPReportModal userId={user?.id ?? ""} />
	  </div>
	  <div className="mt-5">
		<Tabs defaultValue="active">
		  <TabsList>
			<TabsTrigger value="active">Active CBYDP Report</TabsTrigger>
			<TabsTrigger value="inactive">Inactive CBYDP Report</TabsTrigger>
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
