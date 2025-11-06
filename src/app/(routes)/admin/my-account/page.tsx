import React from "react";
import { getServerSession } from "@/lib/session";
import { redirect } from "next/navigation";
import Heading from "@/components/globals/heading";
import ProfileForm from "./_components/profile-form";

const Page = async () => {
  const user = await getServerSession();

  // If no session exists, redirect to sign-in
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="p-5">
      <Heading
        title="My Account"
        description="Manage your profile information and account settings."
      />
      <ProfileForm user={user} />
    </div>
  );
};

export default Page;



