"use client";

import {
  IconBuildingBank,
  IconChevronDown,
  type Icon,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useState } from "react";
import { BARANGAYS } from "@/lib/constants";
import { usePathname, useRouter } from "next/navigation";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedBarangay, setSelectedBarangay] = useState<string>("Burol");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip={selectedBarangay}
              className="dark:bg-[#98a4ff] bg-[#0e1e96] text-white hover:bg-primary/90 active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear rounded-none"
            >
              <IconBuildingBank />
              <span>{selectedBarangay}</span>
            </SidebarMenuButton>
            {isOpen && (
              <div className="absolute top-full mt-1 left-0 w-full max-h-60 overflow-y-auto bg-white dark:bg-muted shadow-lg z-10 border border-gray-200 dark:border-gray-700 rounded-md">
                {BARANGAYS.map((barangay) => (
                  <button
                    key={barangay}
                    onClick={() => {
                      setSelectedBarangay(barangay);
                      setIsOpen(false);
                      router.push(
                        `/admin/${pathname.split("/").slice(-1)[0]}?barangay=${barangay
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`
                      );
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                      barangay === selectedBarangay
                        ? "bg-gray-100 dark:bg-gray-800 font-semibold"
                        : ""
                    }`}
                  >
                    {barangay}
                  </button>
                ))}
              </div>
            )}
            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
              onClick={() => setIsOpen(!isOpen)}
            >
              <IconChevronDown
                className={`transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton onClick={() => router.push(item.url)} tooltip={item.title} isActive={pathname === item.url || pathname.startsWith(item.url)}>
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
