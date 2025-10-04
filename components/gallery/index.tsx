'use client'
import { cn } from "@/lib/utils";
import { IGallery } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Gallery() {
  const [gallery, setGallery] = useState<IGallery[]>([]);
  const [current, setCurrent] = useState<IGallery | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch('/api/gallery');
        const data = await res.json();
        setGallery(data);
        setCurrent(data.find((item: IGallery) => item.current) || null);
        toast.success("Gallery fetched");
      } catch (error) {
        toast.error("Error fetching gallery");
        console.error(error);
      }
    };
    fetchGallery();
  }, []);

  const handleMakeCurrent = async (id: string) => {
    try {
      const res = await fetch(`/api/gallery/`, {
        method: 'PUT',
        body: JSON.stringify({_id: id}),
      });
      const data = await res.json();
      setCurrent(data);
      toast.success("Image made current");
    }
    catch (error) {
      console.error(error);
      toast.error("Error making image current");
    }
  };
  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-semibold">Gallery</h1>
      
      {/* Pinterest-like Masonry Layout */}
      <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 space-y-4">
        {gallery.map((item) => (
          <div
            key={item._id}
            className="break-inside-avoid cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
            onClick={async() => {
                setCurrent(item);
                await handleMakeCurrent(item._id);
            }}
          >
            <img
              src={item.image}
              alt={item.image}
              className={cn(
                "w-full rounded-lg object-cover",
                current?._id === item._id  ? "border-2 border-blue-500 opacity-70" : ""
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
