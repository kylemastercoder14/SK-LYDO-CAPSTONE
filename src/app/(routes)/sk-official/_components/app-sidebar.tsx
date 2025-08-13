"use client";

import * as React from "react";
import {
  IconClock,
  IconDashboard,
  IconDatabase,
  IconFileCheck,
  IconFileDescription,
  IconSpeakerphone,
  IconUsersGroup,
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
import { OfficialType } from '@prisma/client';

const data = {
  CHAIRPERSON: [
    {
      title: "Dashboard",
      url: "/sk-official/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Budget & Project Proposal",
      url: "/sk-official/budget-project-proposal",
      icon: IconFileCheck,
    },
    {
      title: "Project Reports",
      url: "/sk-official/project-reports",
      icon: IconFileDescription,
    },
    {
      title: "Budget Reports",
      url: "/sk-official/budget-reports",
      icon: IconWallet,
    },
    {
      title: "CBYDP",
      url: "/sk-official/cbydp",
      icon: IconUsersGroup,
    },
    {
      title: "Meeting Agenda",
      url: "/sk-official/meeting-agenda",
      icon: IconDatabase,
    },
    {
      title: "Minutes of Meeting",
      url: "/sk-official/minutes-of-meeting",
      icon: IconClock,
    },
  ],
  KAGAWAD: [
    {
      title: "Dashboard",
      url: "/sk-official/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Budget & Project Proposal",
      url: "/sk-official/budget-project-proposal",
      icon: IconFileCheck,
    },
    {
      title: "Events & Activities",
      url: "/sk-official/events-activities",
      icon: IconSpeakerphone,
    },
  ],
  TREASURER: [
    {
      title: "Dashboard",
      url: "/sk-official/dashboard",
      icon: IconDashboard,
    },
     {
      title: "Budget Reports",
      url: "/sk-official/budget-reports",
      icon: IconWallet,
    },
    {
      title: "Budget & Project Proposal",
      url: "/sk-official/budget-project-proposal",
      icon: IconFileCheck,
    },
  ],
  SECRETARY: [
    {
      title: "Dashboard",
      url: "/sk-official/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Minutes of Meeting",
      url: "/sk-official/minutes-of-meeting",
      icon: IconClock,
    },
    {
      title: "Resolution",
      url: "/sk-official/resolution",
      icon: IconClock,
    },
    {
      title: "Project Reports",
      url: "/sk-official/project-reports",
      icon: IconFileDescription,
    },
  ]
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  barangay: string;
  officialType: OfficialType;
}

export function AppSidebar({ officialType, barangay, ...props }: AppSidebarProps) {
  const navItems = data[officialType];
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
        <NavMain barangay={barangay} items={navItems} />
      </SidebarContent>
    </Sidebar>
  );
}
