"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch"; // Import the Switch component

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  // Handle the switch's checked state and theme changes
  const handleThemeChange = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  return (
    <div className="flex items-center space-x-2">
      <Sun className="h-5 w-5" />
      <Switch
        id="theme-toggle"
        // The switch should be checked if the current theme is dark
        checked={theme === "dark"}
        onCheckedChange={handleThemeChange}
      />
      <Moon className="h-5 w-5" />
    </div>
  );
}
