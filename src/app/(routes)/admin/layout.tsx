import React from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/app-sidebar";
import { SiteHeader } from "./_components/site-header";
import { getServerSession } from "@/lib/session";
import { redirect } from "next/navigation";

const AdminLayout = async ({children}: {children: React.ReactNode}) => {
  const user = await getServerSession();

  // If no session exists, redirect to sign-in
  if (!user) {
    redirect("/sign-in");
  }

  // Optional: Verify user role if needed
  if (user.role !== "ADMIN") {
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
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader user={user} />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;
