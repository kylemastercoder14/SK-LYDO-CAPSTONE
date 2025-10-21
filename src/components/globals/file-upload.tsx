/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  UploadCloud,
  Trash,
  FileText,
  FileSpreadsheet,
  FileArchive,
  FileQuestion,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { uploadToSupabase } from "@/lib/upload";

const SingleFileUpload = ({
  onFileUpload,
  defaultValue = "",
  className,
  disabled,
  bucket = "assets",
  maxFileSizeMB = 5, // New prop for configurable max file size
  acceptedFileTypes = {
    // New prop for configurable accepted file types
    "image/*": [
      ".png",
      ".jpeg",
      ".jpg",
      ".webp",
      ".svg",
      ".gif",
      ".bmp",
      ".tiff",
    ],
    "application/pdf": [".pdf"],
    "application/msword": [".doc"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
      ".docx",
    ],
    "application/vnd.ms-excel": [".xls"],
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
      ".xlsx",
    ],
    "application/vnd.ms-powerpoint": [".ppt"],
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      [".pptx"],
    "text/plain": [".txt"],
    "text/csv": [".csv"],
  },
}: {
  onFileUpload: (file: { url: string; size: number; type: string }) => void;
  defaultValue?: string;
  className?: string;
  disabled?: boolean;
  bucket?: string;
  maxFileSizeMB?: number; // New prop type
  acceptedFileTypes?: Record<string, string[]>; // New prop type
}) => {
  const [fileUrl, setFileUrl] = useState<string>(defaultValue); // Renamed state
  const [isUploading, setIsUploading] = useState(false);
  const [fileType, setFileType] = useState<string | null>(null); // To store the type of the uploaded file

  useEffect(() => {
    // Reset the file URL first
    setFileUrl(typeof defaultValue === "string" ? defaultValue : "");

    // Only run the file-type detection if defaultValue is a string
    if (typeof defaultValue === "string" && defaultValue.trim() !== "") {
      const fileExt = defaultValue.split(".").pop()?.toLowerCase();
      if (fileExt) {
        const mimeMap: { [key: string]: string } = {
          png: "image/png",
          jpg: "image/jpeg",
          jpeg: "image/jpeg",
          gif: "image/gif",
          bmp: "image/bmp",
          webp: "image/webp",
          svg: "image/svg+xml",
          tiff: "image/tiff",
          pdf: "application/pdf",
          doc: "application/msword",
          docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          xls: "application/vnd.ms-excel",
          xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          ppt: "application/vnd.ms-powerpoint",
          pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          txt: "text/plain",
          csv: "text/csv",
        };
        setFileType(mimeMap[fileExt] || null);
      } else {
        setFileType(null);
      }
    } else {
      setFileType(null);
    }
  }, [defaultValue]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: acceptedFileTypes, // Use the new prop here
    maxFiles: 1,
    multiple: false,
    onDrop: async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      // Check file size against the new maxFileSizeMB prop
      if (file.size > maxFileSizeMB * 1024 * 1024) {
        toast.error(`File size exceeds ${maxFileSizeMB}MB limit.`);
        return;
      }

      setFileType(file.type); // Set the file type of the newly dropped file
      const previewUrl = URL.createObjectURL(file);
      setFileUrl(previewUrl);

      try {
        toast.loading("Uploading file...");
        const { url } = await uploadToSupabase(file, {
          bucket: "assets",
          onUploading: setIsUploading,
        });
        setFileUrl(url);
        onFileUpload({
          url,
          size: file.size,
          type: file.type || "application/pdf",
        });
        toast.success("File uploaded successfully!");
      } catch (error) {
        console.error("File upload error:", error);
        setFileUrl("");
        setFileType(null); // Clear file type on error
        toast.error("File upload failed. Please try again.");
      } finally {
        toast.dismiss();
      }
    },
    onDropRejected: (fileRejections) => {
      fileRejections.forEach(({ errors }) => {
        errors.forEach((error) => {
          toast.error(error.message);
        });
      });
    },
  });

  const handleRemoveFile = async () => {
    // Renamed handler
    if (!fileUrl) return;

    try {
      const url = new URL(fileUrl);
      const filePath = url.pathname.split(`${bucket}/`).pop();

      if (filePath) {
        const supabase = createClient();
        const client = await supabase;
        const { error } = await client.storage.from(bucket).remove([filePath]);
        if (error) console.error("Error deleting file:", error);
      }
    } catch (error) {
      console.error("Error parsing URL:", error);
    }

    setFileUrl("");
    setFileType(null); // Clear file type on removal
    onFileUpload({ url: "", size: 0, type: "" });
  };

  // Helper function to render a file icon based on file type
  const renderFileIcon = (type: string | null) => {
    if (!type)
      return <FileQuestion className="w-16 h-16 text-muted-foreground" />;
    if (type.startsWith("image/"))
      return <UploadCloud className="w-16 h-16 text-muted-foreground" />; // Use UploadCloud for images
    if (type.includes("pdf"))
      return <FileText className="w-16 h-16 text-muted-foreground" />;
    if (type.includes("word") || type.includes("text"))
      return <FileText className="w-16 h-16 text-muted-foreground" />;
    if (
      type.includes("excel") ||
      type.includes("spreadsheet") ||
      type.includes("csv")
    )
      return <FileSpreadsheet className="w-16 h-16 text-muted-foreground" />;
    if (type.includes("powerpoint"))
      return <FileArchive className="w-16 h-16 text-muted-foreground" />; // Using FileArchive for presentation files
    return <FileQuestion className="w-16 h-16 text-muted-foreground" />;
  };

  const getFileNameFromUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const parts = pathname.split("/");
      return parts[parts.length - 1]; // Get the last part of the path
    } catch (error) {
      console.error("Error parsing URL for file name:", error);
      return "Unknown File";
    }
  };

  return (
    <div className={cn("relative", className)}>
      {!fileUrl ? (
        <div
          {...getRootProps({
            className: `w-full h-[200px] border-2 rounded-md border-dashed border-input flex flex-col items-center justify-center text-center p-4 ${
              disabled || isUploading
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`,
          })}
        >
          <input {...getInputProps()} disabled={disabled || isUploading} />
          <UploadCloud className="w-6 h-6 text-muted-foreground" />
          <p className="mt-2 font-medium text-sm text-black dark:text-white mb-1">
            Drag & drop file here
          </p>
          <p className="text-xs text-muted-foreground">
            Or click to browse (1 file, up to {maxFileSizeMB}MB)
          </p>
          <Button
            variant="secondary"
            type="button"
            size="sm"
            className="mt-2"
            disabled={disabled || isUploading}
          >
            {isUploading ? "Uploading..." : "Browse files"}
          </Button>
        </div>
      ) : (
        <div className="relative flex items-center justify-center w-full h-auto min-h-[200px] border border-input rounded-md overflow-hidden bg-gray-50 dark:bg-zinc-900">
          <div className="relative p-4 w-full flex flex-col items-center justify-center">
            {fileType && fileType.startsWith("image/") ? (
              <img
                src={fileUrl}
                alt="Uploaded"
                className="max-w-full max-h-[200px] object-contain"
                // The imageDimensions logic is removed as it's not universally applicable for all file types
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-4">
                {renderFileIcon(fileType)}
                <p className="mt-2 text-sm font-medium text-black dark:text-white text-center">
                  {getFileNameFromUrl(fileUrl)} {/* Display file name */}
                </p>
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 text-blue-600 hover:underline text-sm"
                >
                  View File
                </a>
              </div>
            )}
            <Button
              type="button"
              size="sm"
              variant="destructive"
              className="absolute top-4 right-4 z-10"
              onClick={handleRemoveFile}
              disabled={disabled || isUploading}
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleFileUpload;
