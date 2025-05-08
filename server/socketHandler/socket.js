// Server-side socket handler
const roomUsers = new Map(); // Map to track users in each room: roomId -> array of {socketId, name}
const socketToRoom = new Map(); // Track which room each socket is in
const nameToSocketId = new Map();
const socketToName = new Map();

module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);
    
    // Handle user joining a room
    socket.on("join-room", ({ roomId, Name }) => {
      if (!roomId || !Name) {
        socket.emit("error", { message: "Room ID and Name are required" });
        return;
      }
      
      console.log(`🧑‍💻 ${Name} joined room ${roomId}`);
      
      // Store mappings between names and socket IDs
      nameToSocketId.set(Name, socket.id);
      socketToName.set(socket.id, Name);
      
      // Track which room this socket is in
      socketToRoom.set(socket.id, roomId);
      
      // Initialize room users array if it doesn't exist
      if (!roomUsers.has(roomId)) {
        roomUsers.set(roomId, []);
      }
      
      // Get current users in the room
      const usersInRoom = roomUsers.get(roomId);
      
      // Join the socket room
      socket.join(roomId);
      
      // Add this user to the room's user list
      usersInRoom.push({ socketId: socket.id, name: Name });
      
      // Notify other users in the room that a new user joined
      socket.to(roomId).emit("user-joined", {
        Name,
        socketId: socket.id
      });
      
      // Confirm to the joining user that they've joined successfully
      // Also send the list of other users already in the room
      socket.emit("joined-room", { 
        roomId,
        users: usersInRoom.filter(user => user.socketId !== socket.id)
          .map(user => ({ socketId: user.socketId, name: user.name }))
      });
    });
    
    // Handle call initiation
    socket.on("call-user", ({ to, offer }) => {
      const from = socketToName.get(socket.id);
      
      if (!from) {
        socket.emit("error", { message: "You are not registered with a name" });
        return;
      }
      
      console.log(`📞 ${from} is calling user with socket ID: ${to}`);
      
      // Forward the offer to the target user
      socket.to(to).emit("incoming-call", {
        from,
        offer,
        callerId: socket.id
      });
    });
    
    // Handle call answer
    socket.on("make-answer", ({ to, answer }) => {
      const from = socketToName.get(socket.id);
      
      if (!from) {
        socket.emit("error", { message: "You are not registered with a name" });
        return;
      }
      
      console.log(`✅ ${from} answered call from socket ID: ${to}`);
      
      // Forward the answer to the caller
      socket.to(to).emit("answer-made", {
        from,
        answer,
        answererId: socket.id
      });
    });
    
    // Handle ICE candidates
    socket.on("ice-candidate", ({ to, candidate }) => {
      // Forward the ICE candidate to the peer
      socket.to(to).emit("ice-candidate", {
        from: socket.id,
        candidate
      });
    });
    
    // Handle user disconnection
    socket.on("disconnect", () => {
      const name = socketToName.get(socket.id);
      const roomId = socketToRoom.get(socket.id);
      
      if (name && roomId) {
        console.log(`❌ ${name} disconnected from room ${roomId}`);
        
        // Clean up mappings
        nameToSocketId.delete(name);
        socketToName.delete(socket.id);
        socketToRoom.delete(socket.id);
        
        // Remove user from room users
        if (roomUsers.has(roomId)) {
          const users = roomUsers.get(roomId);
          const updatedUsers = users.filter(user => user.socketId !== socket.id);
          
          if (updatedUsers.length === 0) {
            // If room is empty, delete it
            roomUsers.delete(roomId);
          } else {
            roomUsers.set(roomId, updatedUsers);
          }
        }
        
        // Notify others in the SAME ROOM about disconnection
        socket.to(roomId).emit("user-disconnected", {
          socketId: socket.id,
          name
        });
      }
    });
    
    // Handle errors
    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
  });
};