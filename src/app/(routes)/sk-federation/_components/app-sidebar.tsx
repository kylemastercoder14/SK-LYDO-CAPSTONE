"use client";

import * as React from "react";
import {
  IconDashboard,
  IconDatabase,
  IconFolderCheck,
  IconTrack,
  IconWallet,
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
      url: "/sk-federation/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Project Reports",
      url: "/sk-federation/project-reports",
      icon: IconFolderCheck,
    },
    {
      title: "Budget Reports",
      url: "/sk-federation/budget-reports",
      icon: IconWallet,
    },
    {
      title: "Meeting Agenda",
      url: "/sk-federation/meeting-agenda",
      icon: IconDatabase,
    },
    {
      title: "Progress Project Tracking",
      url: "/lydo/progress-project-tracking",
      icon: IconTrack,
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
              <a href="/sk-federation/dashboard">
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
        <NavMain items={data.navMain} />
      </SidebarContent>
    </Sidebar>
  );
}
