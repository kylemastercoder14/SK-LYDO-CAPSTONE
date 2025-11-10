import React from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/app-sidebar";
import { SiteHeader } from "./_components/site-header";
import { getServerSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { OfficialType, UserRole } from "@prisma/client";
import ActiveStatus from "./_components/active-status";
import HelpCenter from "@/components/globals/help-center";

const SkOfficialLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const user = await getServerSession();

  if (!user) {
    return <p>Loading...</p>; // middleware already handles auth redirect
  }

  // Optional: Verify user role if needed
  if (user.role !== "SK_OFFICIAL") {
    redirect("/unauthorized");
  }
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar
        variant="inset"
        officialType={user.officialType as OfficialType}
        barangay={user.barangay as string}
      />
      <SidebarInset>
        <ActiveStatus userId={user.id} />
        <SiteHeader user={{ ...user, role: user.role as UserRole }} />
        <main className="relative">
          {children}
          <HelpCenter user={user} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default SkOfficialLayout;
