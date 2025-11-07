"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BARANGAYS } from "@/lib/constants";
import { useRouter, useSearchParams } from "next/navigation";

const FilterBarangay = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedBarangay = searchParams.get("barangay") || "all";

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value === "all") {
      // remove the barangay filter to show all
      params.delete("barangay");
    } else {
      params.set("barangay", value);
    }

    router.push(`?${params.toString()}`);
    router.refresh();
  };

  return (
    <Select onValueChange={handleChange} defaultValue={selectedBarangay}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filter by barangay" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Barangays</SelectItem>
        {BARANGAYS.map((barangay) => (
          <SelectItem
            key={barangay}
            value={barangay.toLowerCase().replace(/\s+/g, "-")}
          >
            {barangay}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default FilterBarangay;
