import { PlusIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { buttonVariants } from "@/components/ui/button";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import db from "@/lib/db";

const Page = async () => {
  const data = await db.user.findMany({
    where: {
      isActive: true,
	  role: {
		not: "ADMIN",
	  }
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
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export default Page;
