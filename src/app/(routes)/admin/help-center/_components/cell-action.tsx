"use client";

import React from "react";
import {
  MoreHorizontal,
  ArchiveIcon,
  Loader2,
  CheckCircle2,
  Clock3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { TicketWithUser } from "@/types/interface";

const CellAction = ({ data }: { data: TicketWithUser }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const updateStatus = async (status: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/notifications/help-center/${data.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      toast.success(`Ticket marked as "${status}"`);
      router.refresh();
    } catch (error) {
      toast.error("Error updating status");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0" disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <MoreHorizontal className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => updateStatus("IN_PROGRESS")}>
          <Clock3 className="size-4 mr-2 text-blue-500" />
          Set as In Progress
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => updateStatus("RESOLVED")}>
          <CheckCircle2 className="size-4 mr-2 text-green-500" />
          Mark as Resolved
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <ArchiveIcon className="size-4 mr-2 text-gray-500" />
          Archive
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CellAction;
