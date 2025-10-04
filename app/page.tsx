"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        const fetchImage = async () => {
            setLoading(true);
            const res = await fetch('/api/current');
            const data = await res.json();
            console.log(data);
            setImage(data.image);
            setLoading(false);
        };
        fetchImage();
    }, []);
  return (
    <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        backgroundColor: "black",
        overflow: "hidden",
        userSelect: "none",
    }}  className="flex items-center justify-center w-screen h-screen bg-black overflow-hidden select-none">
      {/* Replace /1.png with your actual image path (public/1.png) */}
      {loading ? <div className="flex items-center justify-center w-screen h-screen bg-black overflow-hidden select-none">
        <Loader2 className="animate-spin" />
      </div> : <img
        src={image || ""}
        alt="fullscreen image"
        style={{
            transform: "rotate(-90deg)",
            objectFit: "cover"
        }}
        className=""
      />}
    
    </div>
  );
}
