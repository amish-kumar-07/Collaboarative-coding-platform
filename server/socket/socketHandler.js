// sockethandler.js
const { Server } = require("socket.io");

const NametoSocketId = new Map();
const SockettoName = new Map();

const initSocket = (server) => {
  const io = new Server(server, { cors: true });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("join-room", (data) => {
      const { roomId, Name } = data;
      console.log("User:", Name, "joined room:", roomId);
      NametoSocketId.set(Name, socket.id);
      SockettoName.set(socket.id, Name);
      socket.join(roomId);
      socket.broadcast.to(roomId).emit("user-joined", { Name });
      socket.emit("joined-room", { roomId });
    });

    socket.on("call-user", (data) => {
      const { Name, offer } = data;
      const socketId = NametoSocketId.get(Name);
      const from = SockettoName.get(socket.id);
      socket.to(socketId).emit("incoming-call", { from, offer });
    });

    socket.on("offer", (data) => {
      socket.to(data.roomId).emit("offer", { offer: data.offer, userId: socket.id });
    });

    socket.on("answer", (data) => {
      socket.to(data.roomId).emit("answer", { answer: data.answer, userId: socket.id });
    });
  });

  return io;
};

module.exports = { initSocket }; 
