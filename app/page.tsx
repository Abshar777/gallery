"use client";

import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function Home() {
  const [index, setIndex] = useState<number>(0);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const searchParams = useSearchParams();
  const screen = searchParams.get("s") || "1";

  useEffect(() => {
    const fetchImage = async () => {
      setLoading(true);
      const res = await fetch(`/api/current?screen=${screen}`);
      const data = await res.json();
      setImages(data || []);
      console.log(data);
      setLoading(false);
    };

    fetchImage();

    // Connect to socket server
    const socket = io();

    socket.on("connect", () => {
      console.log("🟢 Connected to socket:", socket.id);
    });

    // Listen for gallery updates
    socket.on(`galleryUpdated-${screen}`, (data) => {
      console.log("🔁 Gallery updated:", data);
      setImages(data);
    });

    return () => socket.disconnect();
  }, [screen]);

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

  // show image at index at interval
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 60000);
    return () => clearInterval(interval);
  }, [index, images.length, screen]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        backgroundColor: "black",
        overflow: "hidden",
        userSelect: "none",
      }}
      className="flex items-center justify-center w-screen h-screen bg-black overflow-hidden select-none"
    >
      {loading&&images.length<=0 ? (
        <div className="flex items-center justify-center w-screen h-screen bg-black overflow-hidden select-none">
          <Loader2 className="animate-spin" />
        </div>
      ) : imageFileTypes.includes(
          images[index]?.split?.(".").pop()?.toLowerCase() || ""
        ) ? (
        <img
          src={images[index] || ""}
          alt="fullscreen image"
          style={{
            transform: "rotate(-90deg)",
            objectFit: "cover",
          }}
        />
      ) : (
        <video
          src={images[index]}
          autoPlay
          muted
          loop
          playsInline
          style={{
            transform: "rotate(-90deg)",
            objectFit: "cover",
            width: "100%",
            // height: "100%",
          }}
        />
      )}
    </div>
  );
}
