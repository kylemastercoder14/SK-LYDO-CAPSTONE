"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bell,
  Calendar,
  Clock3,
  FileText,
  File,
  User,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface MeetingAgenda {
  id: string;
  name: string;
  date?: string;
  time?: string;
  fileUrl: string;
  uploadedBy: string;
  user: {
    username: string;
  };
}

interface ProjectProposal {
  id: string;
  title: string;
  status: string;
  fileUrl: string;
  reasonForRejection?: string;
  createdBy: string;
  user: {
    username: string;
  };
}

const NotificationDropdown = () => {
  const [meetingAgendas, setMeetingAgendas] = useState<MeetingAgenda[]>([]);
  const [projectProposals, setProjectProposals] = useState<ProjectProposal[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  // 🔹 Extract filename from file URL
  const getFileName = (url: string) => {
    if (!url) return "No file attached";
    return url.split("/").pop() || "Unnamed file";
  };

  // 🟢 Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const [agendasRes, proposalsRes] = await Promise.all([
          fetch("/api/notifications/meeting-agenda"),
          fetch("/api/notifications/project-proposals"),
        ]);

        if (!agendasRes.ok || !proposalsRes.ok)
          throw new Error("Failed to fetch");

        const agendasData = await agendasRes.json();
        const proposalsData = await proposalsRes.json();

        setMeetingAgendas(agendasData);
        setProjectProposals(proposalsData);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const totalNotifications = meetingAgendas.length + projectProposals.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative">
          <Bell />
          {totalNotifications > 0 && (
            <div className="absolute size-2 bg-destructive rounded-full top-0.5 right-0.5"></div>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-[400px] max-h-[420px] overflow-hidden flex flex-col"
        align="end"
      >
        <DropdownMenuLabel>Meeting & Project Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className="overflow-y-auto flex-1">
          {loading ? (
            <div className="flex justify-center items-center py-6 text-muted-foreground">
              <Loader2 className="size-4 mr-2 animate-spin" /> Loading
              notifications...
            </div>
          ) : totalNotifications === 0 ? (
            <div className="text-center text-sm text-muted-foreground py-4">
              No new notifications
            </div>
          ) : (
            <>
              {/* 🗓️ Meeting Agendas */}
              {meetingAgendas.length > 0 && (
                <>
                  <DropdownMenuLabel className="text-xs text-muted-foreground mt-2">
                    Meeting Agendas
                  </DropdownMenuLabel>
                  {meetingAgendas.map((agenda) => (
                    <Link
                      key={agenda.id}
                      href="/sk-official/meeting-agenda"
                      className="hover:bg-accent hover:text-accent-foreground rounded-md transition"
                    >
                      <DropdownMenuItem className="flex flex-col items-start space-y-1 py-2 cursor-pointer">
                        <div className="flex w-full items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Calendar className="text-blue-500 size-4" />
                            <span className="font-medium text-sm">
                              {agenda.name}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          {agenda.date && (
                            <div className="flex items-center gap-1">
                              <Calendar className="size-3" /> {agenda.date}
                            </div>
                          )}
                          {agenda.time && (
                            <div className="flex items-center gap-1">
                              <Clock3 className="size-3" /> {agenda.time}
                            </div>
                          )}
                        </div>

                        {agenda.fileUrl && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <File className="size-3" />
                            <span>{getFileName(agenda.fileUrl)}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <User className="size-3" />
                          {agenda.user?.username || "Unknown"}
                        </div>
                      </DropdownMenuItem>
                    </Link>
                  ))}
                </>
              )}

              {/* 📄 Project Proposals */}
              {projectProposals.length > 0 && (
                <>
                  <DropdownMenuLabel className="text-xs text-muted-foreground mt-2">
                    Project Proposals
                  </DropdownMenuLabel>

                  {projectProposals.map((proposal) => {
                    // Define badge color by status
                    const statusColor =
                      proposal.status === "Pending"
                        ? "text-yellow-600 border-yellow-600"
                        : proposal.status === "Approved" ||
                          proposal.status === "Completed" ||
                          proposal.status === "Accomplished"
                        ? "text-green-600 border-green-600"
                        : proposal.status === "Rejected"
                        ? "text-red-600 border-red-600"
                        : proposal.status === "In Progress"
                        ? "text-blue-600 border-blue-600"
                        : "text-gray-600 border-gray-600";

                    return (
                      <Link
                        key={proposal.id}
                        href="/sk-official/budget-project-proposal"
                        className="hover:bg-accent hover:text-accent-foreground rounded-md transition"
                      >
                        <DropdownMenuItem className="flex flex-col items-start space-y-1 py-2 cursor-pointer">
                          <div className="flex w-full items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FileText
                                className={`size-4 ${
                                  proposal.status === "Rejected"
                                    ? "text-red-500"
                                    : proposal.status === "Approved"
                                    ? "text-green-500"
                                    : "text-yellow-500"
                                }`}
                              />
                              <span className="font-medium text-sm">
                                {proposal.title}
                              </span>
                            </div>
                            <Badge variant="outline" className={statusColor}>
                              {proposal.status}
                            </Badge>
                          </div>

                          {proposal.fileUrl && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                              <File className="size-3" />
                              <span>{getFileName(proposal.fileUrl)}</span>
                            </div>
                          )}

                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <User className="size-3" />
                            {proposal.user?.username || "Unknown"}
                          </div>

                          {/* 🟥 Show rejection reason if Rejected */}
                          {proposal.status === "Rejected" &&
                            proposal.reasonForRejection && (
                              <div className="mt-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-md p-2 w-full">
                                <span className="font-semibold">Reason:</span>{" "}
                                {proposal.reasonForRejection}
                              </div>
                            )}

                          {proposal.status === "Completed" && (
                            <div className="mt-2 text-xs text-green-600 bg-green-50 border border-green-200 rounded-md p-2 w-full">
                              Please upload photo documentations
                            </div>
                          )}
                        </DropdownMenuItem>
                      </Link>
                    );
                  })}
                </>
              )}
            </>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
