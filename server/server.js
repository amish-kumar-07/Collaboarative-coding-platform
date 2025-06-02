const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
<<<<<<< HEAD
const { codexecution, checkStatus } = require("./services/codeexectution");
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const PORT = 3003;
=======
const { Server } = require("socket.io");
const socketHandler = require("./socketHandler/socket");
const { codexecution, checkStatus } = require("./services/codeexectution");

const app = express();
const server = http.createServer(app);
const PORT = 3000;
>>>>>>> upstream/main

// Middleware
app.use(cors());  // You can keep this, it's for express-related requests
app.use(bodyParser.json());
<<<<<<< HEAD
// signaling-server.js

const wss = new WebSocket.Server({ port: 8080 });

const rooms = {};

wss.on('connection', socket => {
  socket.on('message', msg => {
    const data = JSON.parse(msg);

    switch (data.type) {
      case 'join':
        if (!rooms[data.roomId]) rooms[data.roomId] = [];
        
        // Notify existing users about new user
        rooms[data.roomId].forEach(existingSocket => {
          if (existingSocket.readyState === WebSocket.OPEN) {
            existingSocket.send(JSON.stringify({ 
              type: 'user-joined', 
              userId: socket.id 
            }));
          }
        });
        
        rooms[data.roomId].push(socket);
        socket.roomId = data.roomId;
        socket.id = Math.random().toString(36).substring(7);
        
        // Tell the new user they joined and if they should initiate
        socket.send(JSON.stringify({ 
          type: 'joined', 
          initiator: rooms[data.roomId].length === 1,
          userId: socket.id
        }));
        break;

      case 'offer':
      case 'answer':
      case 'ice-candidate':
        const peers = rooms[data.roomId] || [];
        peers.forEach(s => {
          if (s !== socket && s.readyState === WebSocket.OPEN) {
            s.send(msg);
          }
        });
        break;
    }
  });

  socket.on('close', () => {
    const { roomId } = socket;
    if (rooms[roomId]) {
      rooms[roomId] = rooms[roomId].filter(s => s !== socket);
      if (rooms[roomId].length === 0) {
        delete rooms[roomId];
      }
    }
  });
});

console.log('WebSocket signaling server running on ws://localhost:8080');

=======

// Socket.io setup with CORS configuration specific to your frontend
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001", // Frontend URL
    methods: ["GET", "POST"]
  }
});

// Call the socket handler to manage socket events
socketHandler(io);
>>>>>>> upstream/main

// Routes
app.post("/submit", async (req, res) => {
  const { code, language_id, questionid } = req.body;

  try {
    const token = await codexecution(code, language_id, questionid);
    const judgeResult = await checkStatus(token);

    res.json({
      judgeResult,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
