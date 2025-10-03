import { createClient } from "./supabase/client";
import { ensureBlob } from "./utils";

/**
 * Upload a file to Supabase storage.
 *
 * @param file - File to upload
 * @param options.bucket - Supabase storage bucket name
 * @param options.folder - Optional folder path inside the bucket
 * @param options.onUploading - Optional callback for upload state (true/false)
 * @returns {Promise<{ url: string }>} - The public URL of the uploaded file
 */
export async function uploadToSupabase(
  file: File,
  {
    bucket = "assets",
    folder = "",
    onUploading,
  }: {
    bucket?: string;
    folder?: string;
    onUploading?: (uploading: boolean) => void;
  } = {}
): Promise<{ url: string }> {
  const supabase = createClient();
  const client = await supabase;

  const fileExt = file.name.split(".").pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
  const filePath = folder ? `${folder}/${fileName}` : fileName;

  try {
    onUploading?.(true);

    const blob = await ensureBlob(file);

    const { data: uploadData, error: uploadError } = await client.storage
      .from(bucket)
      .upload(filePath, blob, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) throw uploadError;
    if (!uploadData) throw new Error("Upload failed: No data returned");

    const {
      data: { publicUrl },
    } = client.storage.from(bucket).getPublicUrl(uploadData.path);

    if (!publicUrl) throw new Error("Could not generate public URL");

    return { url: publicUrl };
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  } finally {
    onUploading?.(false);
  }
}
