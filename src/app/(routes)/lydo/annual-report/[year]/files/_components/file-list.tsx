/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState } from "react";
import FileCard from "./file-card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";

import { BARANGAYS } from "@/lib/constants";

type Props = {
  reports: any[];
};

const FileList = ({ reports }: Props) => {
  const [search, setSearch] = useState("");
  const [barangay, setBarangay] = useState("all");

  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const matchSearch =
        r.fileType?.toLowerCase().includes(search.toLowerCase()) ||
        r.fileUrl?.toLowerCase().includes(search.toLowerCase());

      const matchBarangay =
        barangay === "all" ||
        r.barangay?.toLowerCase().replace(/\s+/g, "-") === barangay;

      return matchSearch && matchBarangay;
    });
  }, [reports, search, barangay]);

  return (
    <div className="space-y-4">
      {/* 🔎 Search + Filter */}
      <div className="flex gap-3 flex-wrap">
        <Input
          placeholder="Search report..."
          className="w-[260px]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Select value={barangay} onValueChange={(v) => setBarangay(v)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter Barangay" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Barangays</SelectItem>

            {BARANGAYS.map((b) => (
              <SelectItem
                key={b}
                value={b.toLowerCase().replace(/\s+/g, "-")}
              >
                {b}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredReports.length === 0 ? (
        <p className="text-center text-muted-foreground text-sm mt-10">
          No reports found.
        </p>
      ) : (
        <div className="grid lg:grid-cols-6 grid-cols-1 gap-5">
          {filteredReports.map((report) => (
            <FileCard key={`${report.source}-${report.id}`} report={report} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FileList;
