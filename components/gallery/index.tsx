"use client";
import { cn } from "@/lib/utils";
import { IGallery } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

export default function Gallery({ screenId }: { screenId: string }) {
  const [gallery, setGallery] = useState<IGallery[]>([]);
  const [current, setCurrent] = useState<IGallery[]>([]);
  const [multiple, setMultiple] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch(`/api/gallery?screenId=${screenId}`);
        const data = await res.json();
        if (data.length > 0) {
          setGallery(data);
          const current = data.filter((item: IGallery) => item.current);
          console.log(current, current ? current : []);
          setCurrent(current ? current : []);
          toast.success("Gallery fetched");
        } else {
          setGallery([]);
          setCurrent([]);
          toast.warning("Nothing on this screen");
        }
      } catch (error) {
        toast.error("Error fetching gallery");
        console.error(error);
      }
    };
    fetchGallery();
  }, [screenId]);

  const imageFileTypes = [
    "png",
    "jpg",
    "jpeg",
    "gif",
    "webp",
    "svg",
    "ico",
    "bmp",
    "tiff",
    "tif",
    "heic",
    "heif",
    "avif",
    "webp",
    "svg",
    "ico",
    "bmp",
    "tiff",
    "tif",
    "heic",
    "heif",
    "avif",
  ];

  const handleMakeCurrent = async (id: string) => {
    try {
      const res = await fetch(
        `/api/gallery?screenId=${screenId}&multiple=${multiple}`,
        {
          method: "PUT",
          body: JSON.stringify({ _id: id }),
        }
      );
      const data = await res.json();
      setCurrent(data);
      toast.success("Image made current");
    } catch (error) {
      console.error(error);
      toast.error("Error making image current");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/gallery`, {
        method: "DELETE",
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      setGallery(gallery.filter((item: IGallery) => item._id !== id));
      toast.success("Image deleted");
      setIsDeleting(false);
    } catch (error) {
      console.error(error);
      toast.error("Error deleting image");
      setIsDeleting(false);
    }
  };
  return (
    <>
      <div className="fixed w-fit   md:flex hidden md:justify-end items-end right-0 md:p-4">
        {current.length ==1 && <Button
          disabled={isDeleting}
          variant="destructive"
          onClick={() => handleDelete(current[0]?._id || "")}
        >
          {" "}
          {isDeleting ? <Loader2 className="animate-spin" /> : "Delete"}
        </Button>}
      </div>
      <div className="p-4">
        <div className="flex w-full justify-between items-center">
          <h1 className="mb-4 text-2xl font-semibold">Gallery</h1>
          <div className="flex gap-2 items-center">
            <Label className="text-sm font-medium">Multiple</Label>
            <Switch checked={multiple} onCheckedChange={setMultiple} />
          </div>
        </div>

        <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 space-y-4">
          {gallery.map((item) => (
            <div
              key={item._id}
              className="break-inside-avoid cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
              onClick={async () => {
                if (
                  current.find(
                    (currentItem: IGallery) =>
                      currentItem._id === item._id && multiple
                  )
                ) {
                  setCurrent(
                    current.filter(
                      (currentItem: IGallery) => currentItem._id !== item._id
                    )
                  );
                  await handleMakeCurrent(item._id);
                  return;
                }
                if (multiple) {
                  setCurrent([...current, item]);
                } else {
                  setCurrent([item]);
                }
                await handleMakeCurrent(item._id);
              }}
            >
              {imageFileTypes.includes(
                item.image.split(".").pop()?.toLowerCase() || ""
              ) ? (
                <img
                  src={item.image}
                  alt={item.image}
                  className={cn(
                    "w-full rounded-lg object-cover",
                    current &&
                      current.find((currentItem: IGallery) => {
                        console.log(
                          currentItem._id,
                          item._id,
                          currentItem._id === item._id
                        );
                        return currentItem._id === item._id;
                      })
                      ? "border-2 border-blue-500 opacity-70"
                      : ""
                  )}
                />
              ) : (
                <video
                  src={item.image}
                  className={cn(
                    "w-full rounded-lg object-cover",
                    current &&
                      current.find((currentItem: IGallery) => {
                        console.log(
                          currentItem._id,
                          item._id,
                          currentItem._id === item._id
                        );
                        return currentItem._id === item._id;
                      })
                      ? "border-2 border-blue-500 opacity-70"
                      : ""
                  )}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
