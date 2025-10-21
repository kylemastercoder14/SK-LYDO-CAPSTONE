"use client";

import React, { useState, useTransition } from "react";
import {
  EditIcon,
  FileTextIcon,
  MoreHorizontal,
  ArchiveIcon,
  RotateCcw,
  Loader2,
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
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import AlertModal from "@/components/globals/alert-modal";
import { toast } from "sonner";
import { toggleActiveStatusUser } from "@/actions";

const CellAction = ({ user }: { user: User }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleArchive = async () => {
    startTransition(async () => {
      const result = await toggleActiveStatusUser(user.id, !user.isActive);

      if (!result.success) {
        toast.error("Something went wrong");
        return;
      }

      toast.success(
        user.isActive
          ? "User archived successfully"
          : "User restored successfully"
      );

      setIsOpen(false);
      router.refresh();
    });
  };

  return (
    <>
      <AlertModal
        isOpen={isOpen}
        description="This action cannot be undone. You can restore it later."
        onClose={() => setIsOpen(false)}
        onConfirm={handleArchive}
        loading={isPending}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" disabled={isPending}>
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <MoreHorizontal className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => router.push(`/admin/accounts/${user.id}`)}
          >
            <EditIcon className="size-4 mr-2" />
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem>
            <FileTextIcon className="size-4 mr-2" />
            View details
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => setIsOpen(true)}>
            {user.isActive ? (
              <>
                <ArchiveIcon className="size-4 mr-2 text-destructive" />
                Archive
              </>
            ) : (
              <>
                <RotateCcw className="size-4 mr-2 text-green-600" />
                Restore
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CellAction;
