"use client";

import * as React from "react";
import {
  IconBriefcase,
  IconCopyCheck,
  IconDashboard,
  IconFolderCheck,
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
      url: "/lydo/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Budget Reports",
      url: "/lydo/budget-reports",
      icon: IconWallet,
    },
    {
      title: "Project Reports",
      url: "/lydo/project-reports",
      icon: IconFolderCheck,
    },
    {
      title: "Approved Budget & Project",
      url: "/lydo/approved-budget-project",
      icon: IconCopyCheck,
    },
    {
      title: "Annual Report",
      url: "/lydo/annual-report",
      icon: IconBriefcase,
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
        <NavMain items={data.navMain} />
      </SidebarContent>
    </Sidebar>
  );
}
