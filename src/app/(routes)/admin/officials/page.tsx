import React from "react";
import db from "@/lib/db";
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';

const Page = async () => {
  const data = await db.officials.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div className="p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Manage SK Officials</h3>
        <Link
          href="/admin/officials/create"
          className={buttonVariants({ variant: "primary", size: "sm" })}
        >
          <PlusIcon className="size-4" />
          Add officials
        </Link>
      </div>
      <div className="mt-5">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export default Page;
