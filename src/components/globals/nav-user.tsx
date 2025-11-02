/* eslint-disable react/no-unescaped-entities */
"use client";

import {
  IconDotsVertical,
  IconLogout,
  IconSettings,
  IconUpload,
} from "@tabler/icons-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useRouter, usePathname } from "next/navigation";
import { logoutAction, uploadHeaderFooterAction, uploadBarangayBannerAction } from "@/actions";
import { Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    position: string;
    avatar: string;
    barangay: string;
    committee?: string;
    id?: string;
  };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isMobile } = useSidebar();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenBarangay, setIsOpenBarangay] = useState(false);

  // Extract the route prefix from the current pathname
  // Examples: /lydo/dashboard -> /lydo, /sk-federation/budget-report -> /sk-federation
  const getAccountSettingsRoute = () => {
    // Match routes that start with known prefixes
    const routePrefixes = ["/lydo", "/sk-federation", "/sk-official", "/admin"];
    const matchedPrefix = routePrefixes.find((prefix) =>
      pathname.startsWith(prefix)
    );

    // Default to /lydo if no match found (fallback)
    return matchedPrefix ? `${matchedPrefix}/my-account` : "/lydo/my-account";
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const result = await logoutAction();
      if (result.success) {
        router.push(result.redirect || "/");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {/* Loading overlay */}
      {isLoggingOut && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg font-medium">Logging out, please wait...</p>
          </div>
        </div>
      )}

      {/* Upload Header/Footer Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Upload Header & Footer"
      >
        <form
          action={async (formData) => {
            formData.append("barangay", user.barangay);
            const result = await uploadHeaderFooterAction(formData);
            if (result.success) {
              toast.success(result.message);
              setIsOpen(false);
              router.refresh();
            } else {
              toast.error(result.message);
            }
          }}
          className="space-y-4"
        >
          <p className="text-sm text-muted-foreground space-y-1">
            <span>
              You can upload your barangay’s official{" "}
              <strong>header and footer</strong> images for document generation.
            </span>
            <br />
            <span className="block mt-1 text-xs text-amber-600">
              ⚠️ Please upload high-quality images. Low-resolution files may
              appear <strong>stretched, cropped, or pixelated</strong> in the
              generated PDF.
            </span>
            <br />
            <span className="block mt-1 text-xs text-muted-foreground">
              📏 Recommended resolution:
              <ul className="list-disc list-inside">
                <li>
                  Header: <strong>2480 × 350 px</strong> (for A4 width, 300 DPI)
                </li>
                <li>
                  Footer: <strong>2480 × 200 px</strong>
                </li>
                <li>
                  File format: <strong>PNG</strong> or <strong>JPG</strong>
                </li>
              </ul>
            </span>
          </p>

          <div className="space-y-2">
            <label>Header</label>
            <input
              type="file"
              accept="image/*"
              name="header"
              className="w-full text-sm border p-2 rounded-md"
            />
          </div>

          <div className="space-y-2">
            <label>Footer</label>
            <input
              type="file"
              accept="image/*"
              name="footer"
              className="w-full text-sm border p-2 rounded-md"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="ghost"
              type="button"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              <IconUpload className="size-4 mr-2" />
              Upload
            </Button>
          </div>
        </form>
      </Modal>

       {/* Upload Barangay Banner Modal */}
      <Modal
        isOpen={isOpenBarangay}
        onClose={() => setIsOpenBarangay(false)}
        title="Upload Barangay Officials Banner"
      >
        <form
          action={async (formData) => {
            formData.append("barangay", user.barangay);
            if (user.id) {
              formData.append("userId", user.id);
            }
            const result = await uploadBarangayBannerAction(formData);
            if (result.success) {
              toast.success(result.message);
              setIsOpenBarangay(false);
              router.refresh();
            } else {
              toast.error(result.message);
            }
          }}
          className="space-y-4"
        >
          <p className="text-sm text-muted-foreground space-y-1">
            <span>
              You can upload your barangay's official{" "}
              <strong>officials banner</strong> image.
            </span>
            <br />
            <span className="block mt-1 text-xs text-amber-600">
              ⚠️ Please upload high-quality images. Low-resolution files may
              appear <strong>stretched, cropped, or pixelated</strong> when displayed.
            </span>
            <br />
            <span className="block mt-1 text-xs text-muted-foreground">
              📏 Recommended specifications:
              <ul className="list-disc list-inside">
                <li>
                  Resolution: <strong>1920 × 600 px</strong> or higher
                </li>
                <li>
                  Aspect ratio: <strong>16:5</strong> (recommended)
                </li>
                <li>
                  File format: <strong>PNG</strong> or <strong>JPG</strong>
                </li>
                <li>
                  Max file size: <strong>5MB</strong>
                </li>
              </ul>
            </span>
          </p>

          <div className="space-y-2">
            <label className="text-sm font-medium">Banner Image</label>
            <input
              type="file"
              accept="image/*"
              name="banner"
              className="w-full text-sm border p-2 rounded-md"
              required
            />
            <p className="text-xs text-muted-foreground">
              Select a banner image to upload
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="ghost"
              type="button"
              onClick={() => setIsOpenBarangay(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              <IconUpload className="size-4 mr-2" />
              Upload Banner
            </Button>
          </div>
        </form>
      </Modal>

      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-full">
                  <AvatarImage className='object-cover' src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-full">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.position} {user.committee && `(${user.committee})`}
                  </span>
                </div>
                <IconDotsVertical className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "bottom"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-full">
                    <AvatarImage className='object-cover' src={user.avatar} alt={user.name} />
                    <AvatarFallback className="rounded-full">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="text-muted-foreground truncate text-xs">
                      {user.position} {user.committee && `(${user.committee})`}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {user.position === "SECRETARY" && (
                  <DropdownMenuItem
                    className="flex items-center gap-2"
                    onClick={() => setIsOpen(true)}
                  >
                    <IconSettings className="size-4" />
                    Upload Header & Footer
                  </DropdownMenuItem>
                )}
                {user.position === "CHAIRPERSON" && (
                  <DropdownMenuItem
                    className="flex items-center gap-2"
                    onClick={() => setIsOpenBarangay(true)}
                  >
                    <IconUpload className="size-4" />
                    Upload Barangay Banner
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={() => router.push(getAccountSettingsRoute())}
                  className="flex items-center gap-2"
                >
                  <IconSettings className="size-4" />
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex items-center gap-2"
                >
                  <IconLogout className="size-4" />
                  {isLoggingOut ? "Logging out..." : "Log out"}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
}
