"use client";

import React, { useState, useMemo } from "react";
import FileCard from "./file-card";
import { Input } from "@/components/ui/input";
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "@/components/ui/select";

type Props = {
  files: {
    id: string;
    name: string;
    fileSize: string;
    fileType: string;
    fileUrl: string;
    createdAt: string | Date;
  }[];
};

const FileBrowser = ({ files }: Props) => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredFiles = useMemo(() => {
    return files.filter((f) => {
      const matchText =
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.fileType.toLowerCase().includes(search.toLowerCase());

      const matchType =
        typeFilter === "all" ||
        f.fileType.toLowerCase().includes(typeFilter.toLowerCase());

      return matchText && matchType;
    });
  }, [files, search, typeFilter]);

  const uniqueTypes = [
    ...new Set(files.map((f) => f.fileType.split("/").pop() ?? "other")),
  ];

  return (
    <div className="space-y-4">

      {/* 🔎 Search + Filter */}
      <div className="flex gap-3 flex-wrap">
        <Input
          placeholder="Search file..."
          className="w-[260px]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Filter Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {uniqueTypes.map((t) => (
              <SelectItem key={t} value={t}>
                {t.toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 📁 File Grid */}
      {filteredFiles.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center mt-10">
          No files found.
        </p>
      ) : (
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 gap-5">
          {filteredFiles.map((file) => (
            <FileCard key={file.id} report={file} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FileBrowser;
