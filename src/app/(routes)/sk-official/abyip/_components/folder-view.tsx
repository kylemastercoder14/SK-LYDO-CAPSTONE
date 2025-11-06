/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  grouped: Record<string, any[]>;
}

const FolderView = ({ grouped }: Props) => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const yearFolders = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));

  const filtered = useMemo(() => {
    const result: Record<string, any[]> = {};

    yearFolders.forEach((year) => {
      const files = grouped[year];

      let items = files.filter((file) =>
        file.name.toLowerCase().includes(search.toLowerCase())
      );

      if (statusFilter !== "all") {
        const archived = statusFilter === "inactive";
        items = items.filter((f) => f.isArchived === archived);
      }

      if (items.length > 0) {
        result[year] = items;
      }
    });

    return result;
  }, [search, statusFilter, grouped]);

  return (
    <>
      {/* Search + Filter */}
      <div className="mb-4 flex gap-3">
        <Input
          placeholder="Search reports..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="max-w-sm">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Folder Grid */}
      <div className="grid lg:grid-cols-5 grid-cols-1 gap-5">
        {Object.keys(filtered).length === 0 && (
          <p className="text-muted-foreground">No folders found...</p>
        )}

        {Object.keys(filtered).map((year) => {
          const reports = filtered[year];

          return (
            <Card
              key={year}
              onClick={() => router.push(`/sk-official/abyip/${year}`)}
              className="hover:bg-secondary cursor-pointer"
            >
              <CardContent>
                <div className="relative w-full h-40">
                  <Image
                    src="/folder.png"
                    alt="Folder Icon"
                    fill
                    className="object-contain"
                  />
                </div>

                <h3 className="text-center font-semibold text-base">
                  ABYIP – {year}
                </h3>

                <p className="text-center text-muted-foreground text-sm">
                  {reports.length} file{reports.length > 1 ? "s" : ""}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
};

export default FolderView;
