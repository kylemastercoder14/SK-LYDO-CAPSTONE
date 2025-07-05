"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="fixed bottom-4 right-4">
      <Select value={theme} onValueChange={setTheme}>
        <SelectTrigger className="w-[180px] dark:bg-[#30334e] dark:hover:bg-[#30334e]/90 bg-white text-black dark:text-white">
          <SelectValue placeholder="Select theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4" />
              Light
            </div>
          </SelectItem>
          <SelectItem value="dark">
            <div className="flex items-center gap-2">
              <Moon className="h-4 w-4" />
              Dark
            </div>
          </SelectItem>
          <SelectItem value="system">
            <div className="flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              System
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
