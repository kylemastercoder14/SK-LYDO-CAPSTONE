"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import FilterBarangay from "../_components/filter-barangay";
import { Loader2, Users } from "lucide-react";
import { useSearchParams } from 'next/navigation';
import { Badge } from "@/components/ui/badge";

interface ProjectProposal {
  id: string;
  title: string;
  status: string;
  createdBy: string;
  isThereCollaboration?: boolean;
  committee?: string;
  user: {
    committee: string;
  };
}

const Page = () => {
  const searchParams = useSearchParams(); // ✅ get params from URL
  const barangay = searchParams.get("barangay") || ""; // ✅ extract param safely

  const [projects, setProjects] = useState<ProjectProposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const url = barangay
          ? `/api/projects?barangay=${barangay}`
          : `/api/projects`;
        const res = await fetch(url);
        const data = await res.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [barangay]);

  // 🌀 Show loader while fetching
  if (loading)
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );

  // 📭 Show empty state if no projects found
  if (!projects.length)
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Progress Project Tracking</h1>
          <FilterBarangay />
        </div>
        <div className="flex flex-col items-center justify-center h-[50vh] text-center text-gray-500">
          <p className="text-lg font-medium">
            No projects found in this barangay.
          </p>
        </div>
      </div>
    );

  // 📊 Group projects by committee
  const grouped = projects.reduce(
    (acc: Record<string, ProjectProposal[]>, proj) => {
      const committee = proj.user.committee || "Unrequired";
      if (!acc[committee]) acc[committee] = [];
      acc[committee].push(proj);
      return acc;
    },
    {}
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Progress Project Tracking</h1>
        <FilterBarangay />
      </div>

      {Object.entries(grouped).map(([committee, items]) => {
        const total = items.length;
        const accomplishedProjects = items.filter(
          (p) => p.status === "Accomplished" || p.status === "Completed"
        );
        const accomplished = accomplishedProjects.length;
        const pending = items.filter((p) => p.status === "Pending").length;
        const inProgress = items.filter(
          (p) => p.status === "In Progress"
        ).length;
        const progressPercent = total > 0 ? (accomplished / total) * 100 : 0;

        // Filter accomplished projects with collaboration
        const collaboratedProjects = accomplishedProjects.filter(
          (p) => p.isThereCollaboration && p.committee
        );

        return (
          <Card key={committee} className="shadow-md">
            <CardHeader>
              <CardTitle>{committee}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm text-gray-700">
                  <strong>{accomplished}</strong> accomplished out of{" "}
                  <strong>{total}</strong> projects
                </div>
                {collaboratedProjects.length > 0 && (
                  <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-md border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="size-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        Collaborative Projects ({collaboratedProjects.length})
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {collaboratedProjects.map((project) => (
                        <Badge
                          key={project.id}
                          variant="outline"
                          className="text-xs bg-white dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/60"
                        >
                          <Users className="size-3 mr-1" />
                          {project.title}
                          {project.committee && (
                            <span className="ml-1 font-semibold">
                              • {project.committee}
                            </span>
                          )}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <Progress value={progressPercent} className="h-3" />
                <div className="text-xs text-gray-500 mt-2">
                  Pending: {pending} | In Progress: {inProgress} | Accomplished:{" "}
                  {accomplished}
                  {collaboratedProjects.length > 0 && (
                    <span className="ml-2 text-blue-600">
                      • {collaboratedProjects.length} with collaboration
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default Page;
