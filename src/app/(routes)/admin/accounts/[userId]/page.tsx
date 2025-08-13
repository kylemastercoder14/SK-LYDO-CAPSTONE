import React from "react";
import db from "@/lib/db";
import Heading from "@/components/globals/heading";
import UserAccountForm from "@/components/forms/user-account-form";

const Page = async (props: {
  params: Promise<{
    userId: string;
  }>;
}) => {
  const params = await props.params;

  const data = await db.user.findUnique({
    where: {
      id: params.userId,
    },
  });
  return (
    <div className="p-5">
      <Heading
        title={data ? `Edit user account` : "Create new user account"}
        description="Make sure to fill in all the required fields."
      />
      <UserAccountForm initialData={data} />
    </div>
  );
};

export default Page;
