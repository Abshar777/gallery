import { NextRequest } from "next/server";
import { Server as IOServer } from "socket.io";
import { Server as HTTPServer } from "http";

const ioMap = global as unknown as { io?: IOServer };

export const GET = async (req: NextRequest) => {
  if (!ioMap.io) {
    const httpServer = (req as any).socket?.server as HTTPServer;

    const io = new IOServer(httpServer, {
      path: "/api/socket/io",
      cors: { origin: "*" },
    });

    io.on("connection", (socket) => {
      console.log("🟢 Client connected:", socket.id);
      socket.on("disconnect", () => {
        console.log("🔴 Client disconnected:", socket.id);
      });
    });

    ioMap.io = io;
    console.log("✅ Socket.IO initialized");
  }

  return new Response("Socket running", { status: 200 });
};
