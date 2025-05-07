import { Server } from "socket.io";
import {webrtcServices} from "./webrtcservices";

function socketHandler(server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

  const nameToSocket = new Map();
  const socketToName = new Map();

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("join-room", ({ roomId, name }) => {
      console.log(`${name} joined room: ${roomId}`);
      socket.join(roomId);
      nameToSocket.set(name, socket.id);
      socketToName.set(socket.id, name);

      // Notify all members in the room
      socket.broadcast.to(roomId).emit("user-joined", { name });
      socket.emit("joined-room", { roomId });
    });

    // WebRTC signaling 
    webrtcServices(io, socket, nameToSocket, socketToName);

    socket.on("disconnect", () => {
      const name = socketToName.get(socket.id);
      if (name) {
        nameToSocket.delete(name);
        socketToName.delete(socket.id);
        console.log(`${name} disconnected`);
      }
    });
  });
}

module.exports = socketHandler;
