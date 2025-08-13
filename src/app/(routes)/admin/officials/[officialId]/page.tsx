import React from "react";
import db from "@/lib/db";
import Heading from "@/components/globals/heading";
import OfficialForm from "@/components/forms/official-form";

const Page = async (props: {
  params: Promise<{
    officialId: string;
  }>;
}) => {
  const params = await props.params;

  const data = await db.officials.findUnique({
    where: {
      id: params.officialId,
    },
  });

  const users = await db.user.findMany({
    where: {
      isActive: true,
      role: {
        not: "ADMIN",
      },
    },
    orderBy: {
      lastName: "asc",
    },
  });
  return (
    <div className="p-5">
      <Heading
        title={
          data
            ? `Edit officials for a specific barangay`
            : "Create new officials for a specific barangay"
        }
        description="Make sure to fill in all the required fields."
      />
      <OfficialForm initialData={data} users={users} />
    </div>
  );
};

export default Page;
