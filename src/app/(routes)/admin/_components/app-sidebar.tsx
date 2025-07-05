"use client";

import * as React from "react";
import {
  IconDashboard,
  IconDatabase,
  IconFileDescription,
  IconUsersGroup,
} from "@tabler/icons-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import Image from "next/image";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Accounts",
      url: "/admin/accounts",
      icon: IconUsersGroup,
    },
    {
      title: "System Logs",
      url: "/admin/system-logs",
      icon: IconFileDescription,
    },
    {
      title: "Data Backup",
      url: "/admin/data-backup",
      icon: IconDatabase,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/admin/dashboard">
                <div className="relative size-10">
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    fill
                    className="size-full"
                  />
                </div>
                <span className="text-base font-semibold">SK WEB PORTAL</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
    </Sidebar>
  );
}
