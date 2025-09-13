import React from "react";
import Heading from "@/components/globals/heading";
import { DataTable } from "./_components/data-table";
import db from "@/lib/db";
import { columns } from "./_components/columns";
import BudgetDistributionModal from "./_components/budget-distribution-modal";
import { getServerSession } from "@/lib/session";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Page = async () => {
  const user = await getServerSession();

  const data = await db.budgetDistribution.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      barangay: user?.barangay || "",
    },
    include: {
      user: true,
    },
  });

  const years = Array.from(new Set(data.map((budget) => budget.year)))
    .filter((year) => !!year)
    .sort((a, b) => Number(b) - Number(a));

  return (
    <div className="p-5">
      <div className="flex items-center justify-between">
        <Heading
          title="Budget Distributions"
          description="View and manage budget distributions for your barangay."
        />
        <BudgetDistributionModal
          barangay={user?.barangay as string}
          userId={user?.id ?? ""}
        />
      </div>
      <div className="mt-5">
        <Tabs defaultValue={years[0]?.toString() ?? "all"}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            {years.map((year) => (
              <TabsTrigger value={year.toString()} key={year}>
                {year}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* All Data */}
          <TabsContent value="all">
            <DataTable columns={columns} data={data} />
          </TabsContent>

          {/* Per Year */}
          {years.map((year) => (
            <TabsContent value={year.toString()} key={year}>
              <DataTable
                columns={columns}
                data={data.filter((budget) => budget.year === year)}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Page;
