"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { User } from "@prisma/client";
import { useEffect, useState } from "react";
import { getGreeting } from "@/lib/utils";
import { NavUser } from "@/components/globals/nav-user";

export function SiteHeader({ user }: { user: User | null }) {
  const [greeting, setGreeting] = useState(getGreeting());

  useEffect(() => {
    // Update greeting every minute in case the time changes
    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000);

    return () => clearInterval(interval);
  }, []);
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">
          {greeting}, {`${user?.username}` || "Anonymous"}!
        </h1>
        <div className="ml-auto flex items-center gap-2">
          <NavUser
            user={{
              name:
                [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
                user?.username ||
                "Guest",
              position: user?.role || "",
              avatar: user?.image || "",
            }}
          />
        </div>
      </div>
    </header>
  );
}
