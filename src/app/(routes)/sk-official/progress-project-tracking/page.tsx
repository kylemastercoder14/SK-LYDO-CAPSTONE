"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import FilterBarangay from "../_components/filter-barangay";
import { Loader2 } from "lucide-react";

interface ProjectProposal {
  id: string;
  title: string;
  status: string;
  createdBy: string;
  user: {
    committee: string;
  };
}

const Page = ({ searchParams }: { searchParams: { barangay?: string } }) => {
  const barangay = searchParams?.barangay;

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
      const committee = proj.user.committee || "Unassigned";
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
        const accomplished = items.filter(
          (p) => p.status === "Accomplished" || p.status === "Completed"
        ).length;
        const pending = items.filter((p) => p.status === "Pending").length;
        const inProgress = items.filter(
          (p) => p.status === "In Progress"
        ).length;
        const progressPercent = total > 0 ? (accomplished / total) * 100 : 0;

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
                <Progress value={progressPercent} className="h-3" />
                <div className="text-xs text-gray-500 mt-2">
                  Pending: {pending} | In Progress: {inProgress} | Accomplished:{" "}
                  {accomplished}
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
