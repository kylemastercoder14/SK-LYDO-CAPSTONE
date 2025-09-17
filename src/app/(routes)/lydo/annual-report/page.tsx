"use client";

import React from "react";
import Heading from "@/components/globals/heading";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const folders = [2022, 2023, 2024, 2025];
  return (
    <div className="p-5">
      <Heading
        title="Annual Accomplishment Report"
        description="View and manage annual accomplishment reports for your system."
      />
      <div className="mt-5 grid lg:grid-cols-5 grid-cols-1 gap-5">
        {folders.map((year) => (
          <Card
            key={year}
            onClick={() => router.push(`/lydo/annual-report/${year}/files`)}
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
                Annual Report for {year}
              </h3>
              <p className="text-center text-muted-foreground text-sm">
                Annual Report for {year} for all barangay registered.
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Page;
