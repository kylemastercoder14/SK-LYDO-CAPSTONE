"use client";

import { BackupHistory } from "@prisma/client";
import { DatabaseBackup } from "lucide-react";
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { IconRestore } from "@tabler/icons-react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { useRouter } from 'next/navigation';

const Client = ({ backUpHistory }: { backUpHistory: BackupHistory[] }) => {
	const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleBackup = async () => {
    const res = await fetch("/api/database/backup");
    const blob = await res.blob();

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "backup.json";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleRestore = async () => {
    const file = fileInput.current?.files?.[0];
    if (!file) return;

    const text = await file.text();
    const json = JSON.parse(text);

    setIsLoading(true);
    const res = await fetch("/api/database/restore", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(json),
    });

    await res.json();

    setIsLoading(false);
	setIsOpen(false);
	router.refresh();
  };
  return (
    <>
      <Modal
        title="Restore Database"
        description="Upload a JSON file to restore the database"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <div className="flex items-center gap-2">
          <Input type="file" ref={fileInput} accept="application/json" />
          <Button onClick={handleRestore} disabled={isLoading} size="sm">
            Restore Database
          </Button>
        </div>
      </Modal>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Database Backup & Restore</h3>
        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm" onClick={handleBackup}>
            <DatabaseBackup className="size-4" />
            Download Backup
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setIsOpen(true)}>
            <IconRestore className="size-4" />
            Restore Backup
          </Button>
        </div>
      </div>
      <div className="mt-5">
        <DataTable columns={columns} data={backUpHistory} />
      </div>
    </>
  );
};

export default Client;
