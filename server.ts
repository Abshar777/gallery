const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");


const dev = true;
const app = next({ dev });
const handle = app.getRequestHandler();
console.log(dev,"dev 🟢");
async function main() {
  await app.prepare();
  const server = createServer((req:any, res:any) => {
    handle(req, res);
  });

  // ✅ Attach Socket.IO to the same server
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket:any) => {
    console.log("🟢 Socket connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("🔴 Disconnected:", socket.id);
    });
  });

  // ✅ Store globally (accessible in API routes)
  (global as any).io = io;

  const port = process.env.PORT || 3001;
  server.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
  });
}

main();
