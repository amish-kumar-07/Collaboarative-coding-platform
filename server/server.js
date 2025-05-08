const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const socketHandler = require("./socketHandler/socket");
const { codexecution, checkStatus } = require("./services/codeexectution");

const app = express();
const server = http.createServer(app);
const PORT = 3000;

// Middleware
app.use(cors());  // You can keep this, it's for express-related requests
app.use(bodyParser.json());

// Socket.io setup with CORS configuration specific to your frontend
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001", // Frontend URL
    methods: ["GET", "POST"]
  }
});

// Call the socket handler to manage socket events
socketHandler(io);

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
