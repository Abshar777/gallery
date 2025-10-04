"use client"

import type React from "react"

import { useCallback, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function DragDropZone({
  onFiles,
}: {
  onFiles: (files: File[]) => void
}) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])
  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])
  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
      const files = Array.from(e.dataTransfer.files || [])
      if (files.length) onFiles(files)
    },
    [onFiles],
  )

  const onChoose = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || [])
      if (files.length) onFiles(files)
      e.currentTarget.value = ""
    },
    [onFiles],
  )

  return (
    <div
      className={cn(
        "rounded-md border-2 border-dashed p-6 transition-colors",
        "bg-card text-card-foreground border-border",
        isDragging ? "border-primary" : "border-muted-foreground/30",
      )}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      role="region"
      aria-label="Drag and drop image upload"
    >
      <div className="flex flex-col items-center justify-center gap-3 text-center">
        <div className="text-sm text-muted-foreground">Drag and drop images here, or click to select</div>
        <label>
          <input ref={fileInputRef} type="file" accept="image/*" multiple className="sr-only" onChange={onChoose} />
          <Button onClick={() => fileInputRef.current?.click()} type="button" variant="secondary" className="bg-secondary text-secondary-foreground">
            Choose files
          </Button>
        </label>
        <p className="text-xs text-muted-foreground">Only image files are accepted.</p>
      </div>
    </div>
  )
}
