import { PlusIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { buttonVariants } from "@/components/ui/button";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import db from "@/lib/db";

const Page = async () => {
  const data = await db.user.findMany({
    where: {
      role: {
        not: "ADMIN",
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div className="p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Manage Users Account</h3>
        <Link
          href="/admin/accounts/create"
          className={buttonVariants({ variant: "primary", size: "sm" })}
        >
          <PlusIcon className="size-4" />
          Add new user
        </Link>
      </div>
      <div className="mt-5">
        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>
          <TabsContent value="active">
            <DataTable columns={columns} data={data.filter((d) => d.isActive)} />
          </TabsContent>
          <TabsContent value="inactive">
            <DataTable columns={columns} data={data.filter((d) => !d.isActive)} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Page;
