"use client";

import React, { useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { extractFileName, fileIcon } from "@/lib/utils";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { deleteFileActionAbyip } from "@/actions";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

type FileCardProps = {
  report: {
    id: string;
    fileUrl: string;
    fileType?: string;
  };
  userRole: string;
};

const PdfViewer = dynamic(() => import("./pdf-viewer"), {
  ssr: false,
});

const FileCard = ({ report, userRole }: FileCardProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const fileName = extractFileName(report.fileUrl);
  const fileType = report.fileType ?? "";

  const fileNameLower = fileName.toLowerCase();
  const typeLower = fileType.toLowerCase();

  const isImage =
    typeLower.startsWith("image/") ||
    /\.(png|jpe?g|gif|webp)$/i.test(fileNameLower);

  const isPdf = typeLower.includes("pdf") || fileNameLower.endsWith(".pdf");

  const isDoc =
    typeLower.includes("word") || /\.(docx?|odt)$/i.test(fileNameLower);

  const isExcel =
    typeLower.includes("excel") || /\.(xlsx?|csv)$/i.test(fileNameLower);

  const isPpt =
    typeLower.includes("presentation") || /\.(pptx?|odp)$/i.test(fileNameLower);

  const officeUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
    report.fileUrl
  )}`;
  const googleUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(
    report.fileUrl
  )}&embedded=true`;

  const handleOpenFile = () => {
    window.open(report.fileUrl, "_blank", "noopener,noreferrer");
  };

  const handleDelete = () => {
    startTransition(async () => {
      const res = await deleteFileActionAbyip(report.id);
      if (res.success) {
        toast.success(res.message);
        router.refresh();
      } else {
        toast.error(res.message);
      }
    });
  };

  return (
    <Card
      onClick={handleOpenFile}
      className="bg-secondary p-0 hover:bg-zinc-200 relative cursor-pointer"
    >
      <CardContent className="p-3 space-y-3">
        {userRole === "TREASURER" && (
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            disabled={isPending}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
          >
            <Trash2 className="size-4" />
          </Button>
        )}
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="relative size-5">
            <Image
              src={fileIcon(fileType || fileName)}
              alt={fileName}
              fill
              className="object-contain"
            />
          </div>
          <span className="font-medium truncate">{fileName}</span>
        </div>

        {/* Preview */}
        <div className="bg-white mt-5 rounded-lg relative w-full h-44 flex items-center justify-center overflow-hidden">
          {isImage ? (
            <Image
              src={report.fileUrl}
              alt={fileName}
              fill
              className="object-contain"
            />
          ) : isPdf ? (
            <PdfViewer fileUrl={report.fileUrl} />
          ) : isDoc || isExcel || isPpt ? (
            <iframe
              src={officeUrl}
              className="w-full h-full border-0"
              onError={(e) => {
                // fallback to Google Docs
                (e.currentTarget as HTMLIFrameElement).src = googleUrl;
              }}
            />
          ) : (
            <div className="flex flex-col items-center text-gray-500 text-sm">
              <Image
                src={fileIcon(fileType || fileName)}
                alt="file icon"
                width={40}
                height={40}
              />
              <span className="mt-2">No preview available</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FileCard;
