"use client"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type LocalFile = {
  id: string
  previewUrl: string
  type: string
  isCurrent: boolean
  status: "pending" | "uploading" | "done" | "error"
  progress: number
  errorMessage?: string
}

const imageFileTypes =['png','jpg','jpeg','gif','webp','svg','ico','bmp','tiff','tif','heic','heif','avif','webp','svg','ico','bmp','tiff','tif','heic','heif','avif'];

export function PreviewGrid({
  files,
  onMakeCurrent,
  onRemove,
}: {
  files: LocalFile[]
  onMakeCurrent: (id: string) => void
  onRemove: (id: string) => void
}) {
  if (!files.length) return null
  console.log(files);
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {files.map((f) => (
        <figure
          key={f.id}
          className={cn(
            "relative rounded-md border overflow-hidden",
            "bg-card text-card-foreground border-border",
            f.isCurrent ? "ring-2 ring-primary" : "",
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
         {
          imageFileTypes.includes(f.type.split('/')[1]) ? (
            <img
              src={f.previewUrl || "/placeholder.svg"}
              alt="Preview"
              className="h-40 w-full object-cover"
              crossOrigin="anonymous"
            />
          ) : (
            <video src={f.previewUrl} className="h-40 w-full object-cover" controls />
          )
         }
          <figcaption className="p-2 flex items-center justify-between gap-2">
           
            <Button size="sm" variant="ghost" onClick={() => onRemove(f.id)}>
              Remove
            </Button>
          </figcaption>

          {f.status !== "pending" && (
            <div className="absolute bottom-0 left-0 right-0">
              {f.status === "uploading" && (
                <div className="h-1 bg-muted">
                  <div className="h-1 bg-primary transition-all" style={{ width: `${f.progress}%` }} />
                </div>
              )}
              {f.status === "done" && (
                <div className="px-2 py-1 text-xs bg-primary text-primary-foreground">Uploaded</div>
              )}
              {f.status === "error" && (
                <div className="px-2 py-1 text-xs bg-destructive text-destructive-foreground">
                  {f.errorMessage || "Error"}
                </div>
              )}
            </div>
          )}
        </figure>
      ))}
    </div>
  )
}
