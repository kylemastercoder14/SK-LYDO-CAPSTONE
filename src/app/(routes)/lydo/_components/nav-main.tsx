"use client";

import { IconBuildingBank, type Icon } from "@tabler/icons-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathname, useRouter } from "next/navigation";

export function NavMain({
  items,
  barangay,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
  barangay: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip={barangay.toUpperCase().replace(/-/g, " ")}
              className="dark:bg-[#98a4ff] bg-[#0e1e96] text-white hover:bg-primary/90 active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear rounded-none"
            >
              <IconBuildingBank />
              <span>{barangay.toUpperCase().replace(/-/g, " ")}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                onClick={() => router.push(item.url)}
                tooltip={item.title}
                isActive={
                  pathname === item.url || pathname.startsWith(item.url)
                }
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
