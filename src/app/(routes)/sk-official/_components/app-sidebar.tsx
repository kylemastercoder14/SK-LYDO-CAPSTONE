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
      url: "/sk-official/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Accounts",
      url: "/sk-official/accounts",
      icon: IconUsersGroup,
    },
    {
      title: "System Logs",
      url: "/sk-official/system-logs",
      icon: IconFileDescription,
    },
    {
      title: "Data Backup",
      url: "/sk-official/data-backup",
      icon: IconDatabase,
    },
  ],
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  barangay: string;
}

export function AppSidebar({ barangay, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/sk-official/dashboard">
                <div className="relative size-8">
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
        <NavMain barangay={barangay} items={data.navMain} />
      </SidebarContent>
    </Sidebar>
  );
}
