"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { DragDropZone } from "./drag-drop-zone";
import { PreviewGrid } from "./preview-grid";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type LocalFile = {
  id: string;
  file: File;
  previewUrl: string;
  isCurrent: boolean;
  status: "pending" | "uploading" | "done" | "error";
  progress: number;
  result?: {
    secure_url: string;
    public_id: string;
    width?: number;
    height?: number;
    bytes?: number;
    format?: string;
  };
  errorMessage?: string;
};

type SignResponse =
  | {
      signature: string;
      timestamp: number;
      apiKey: string;
      cloudName: string;
      folder: string;
    }
  | { error: string };

function uid() {
  return Math.random().toString(36).slice(2);
}

export function Uploader() {
  const [files, setFiles] = useState<LocalFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  // cleanup object URLs
  useEffect(() => {
    return () => {
      files.forEach((f) => URL.revokeObjectURL(f.previewUrl));
    };
  }, [files]);

  const onFilesAdded = useCallback((newFiles: File[]) => {
    const next: LocalFile[] = newFiles
      .filter((f) => f.type.startsWith("image/"))
      .map((file) => ({
        id: uid(),
        file,
        previewUrl: URL.createObjectURL(file),
        isCurrent: false,
        status: "pending" as const,
        progress: 0,
      }));
    setFiles((prev) => [...prev, ...next]);
  }, []);

  const selectedCount = useMemo(
    () => files.filter((f) => f.isCurrent).length,
    [files]
  );

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const found = prev.find((f) => f.id === id);
      if (found) URL.revokeObjectURL(found.previewUrl);
      return prev.filter((f) => f.id !== id);
    });
  };

  const clearAll = () => {
    files.forEach((f) => URL.revokeObjectURL(f.previewUrl));
    setFiles([]);
  };

  async function getSignature(): Promise<
    Extract<SignResponse, { signature: string }>
  > {
    const res = await fetch("/api/cloudinary-signature", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folder: "v0-uploads" }),
    });
    const data: SignResponse = await res.json();
    if (!res.ok || "error" in data) {
      throw new Error(
        ("error" in data && data.error) || "Failed to get signature"
      );
    }
    return data;
  }

  // XMLHttpRequest upload for progress support
  function uploadWithProgress({
    file,
    cloudName,
    apiKey,
    timestamp,
    signature,
    folder,
    onProgress,
  }: {
    file: File;
    cloudName: string;
    apiKey: string;
    timestamp: number;
    signature: string;
    folder: string;
    onProgress: (pct: number) => void;
  }) {
    return new Promise<any>((resolve, reject) => {
      const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
      const fd = new FormData();
      fd.append("file", file);
      fd.append("api_key", apiKey);
      fd.append("timestamp", String(timestamp));
      fd.append("signature", signature);
      fd.append("folder", folder);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", url);
      xhr.upload.addEventListener("progress", (evt) => {
        if (evt.lengthComputable) {
          const pct = Math.round((evt.loaded / evt.total) * 100);
          onProgress(pct);
        }
      });
      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              resolve(JSON.parse(xhr.responseText));
            } catch (e) {
              resolve(xhr.responseText);
            }
          } else {
            reject(
              new Error(`Upload failed: ${xhr.status} ${xhr.responseText}`)
            );
          }
        }
      };
      xhr.send(fd);
    });
  }

  const startUpload = async () => {
    if (!files.length) return;
    setIsUploading(true);
    try {
      const { signature, timestamp, apiKey, cloudName, folder } =
        await getSignature();

      // Upload sequentially to keep UI simple; could parallelize if desired.
      for (const f of files) {
        setFiles((prev) =>
          prev.map((x) =>
            x.id === f.id ? { ...x, status: "uploading", progress: 0 } : x
          )
        );
        try {
          const result = await uploadWithProgress({
            file: f.file,
            cloudName,
            apiKey,
            timestamp,
            signature,
            folder,
            onProgress: (pct) =>
              setFiles((prev) =>
                prev.map((x) => (x.id === f.id ? { ...x, progress: pct } : x))
              ),
          });
          await uploadToGallery(result.secure_url);
          setFiles((prev) =>
            prev.map((x) =>
              x.id === f.id
                ? { ...x, status: "done", result, progress: 100 }
                : x
            )
          );
       
        } catch (err: any) {
         
          setFiles((prev) =>
            prev.map((x) =>
              x.id === f.id
                ? {
                    ...x,
                    status: "error",
                    errorMessage: err?.message || "Upload error",
                  }
                : x
            )
          );
        }
      }
    } catch (e: any) {
      toast.error("Error uploading image");
      console.error("[v0] Signature error:", e?.message);
    } finally {
      setIsUploading(false);
      if(typeof window !== "undefined"){
        window.location.reload();
      }
    }
  };

  const uploadToGallery = async (url: string) => {
    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        body: JSON.stringify({ image: url }),
      });
      const data = await res.json();
      console.log(data);
      toast.success("Image uploaded");
   
    } catch (error) {
      toast.error("Error uploading image");
      console.error(error);
    }
  };
  const hasDone = files.some((f) => f.status === "done");

  return (
    <section className="flex flex-col gap-6">
      <DragDropZone onFiles={onFilesAdded} />

      <PreviewGrid
        files={files}
        onMakeCurrent={() => {}}
        onRemove={removeFile}
      />

      <div
        className={cn(
          "flex items-center gap-3",
          files.length ? "justify-between" : "justify-end"
        )}
      >
        {files.length > 0 && (
          <Button
            variant="secondary"
            className="bg-secondary text-secondary-foreground"
            onClick={clearAll}
            disabled={isUploading}
          >
            Clear
          </Button>
        )}
        <div className="ml-auto flex items-center gap-3">
          <span className="text-muted-foreground text-sm">
            {selectedCount === 1
              ? "1 image marked as current"
              : selectedCount > 1
              ? `${selectedCount} images marked current`
              : "No current image selected"}
          </span>

          <Button onClick={startUpload} disabled={!files.length || isUploading}>
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </div>

  
    </section>
  );
}
