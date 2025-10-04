"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchImage = async () => {
      setLoading(true);
      const res = await fetch("/api/current");
      const data = await res.json();
      setImage(data?.image || null);
      setLoading(false);
    };

    fetchImage();

    // Connect to socket server
    const socket = io();


    socket.on("connect", () => {
      console.log("🟢 Connected to socket:", socket.id);
    });

    // Listen for gallery updates
    socket.on("galleryUpdated", (data) => {
      console.log("🔁 Gallery updated:", data);
      setImage(data.image);
    });

    return () => socket.disconnect();
  }, []);

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
      {loading ? (
        <div className="flex items-center justify-center w-screen h-screen bg-black overflow-hidden select-none">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <img
          src={image || ""}
          alt="fullscreen image"
          style={{
            transform: "rotate(-90deg)",
            objectFit: "cover",
          }}
        />
      )}
    </div>
  );
}
