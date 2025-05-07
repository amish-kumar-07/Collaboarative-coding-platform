function webrtcServices(io, socket, nameToSocket, socketToName) {
    socket.on("call-user", ({ name, offer }) => {
      const socketId = nameToSocket.get(name);
      const from = socketToName.get(socket.id);
      if (socketId) {
        socket.to(socketId).emit("incoming-call", { from, offer });
      }
    });
  
    socket.on("answer-call", ({ name, answer }) => {
      const socketId = nameToSocket.get(name);
      const from = socketToName.get(socket.id);
      if (socketId) {
        socket.to(socketId).emit("call-answered", { from, answer });
      }
    });
  
    socket.on("ice-candidate", ({ name, candidate }) => {
      const socketId = nameToSocket.get(name);
      if (socketId) {
        socket.to(socketId).emit("ice-candidate", { candidate });
      }
    });
  }
  
  module.exports = webrtcServices;
  
