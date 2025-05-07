const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const socketHandler = require("./socketHandler");

const { codexecution, checkStatus } = require("./services/codeexectution");

const app = express();
const port = 3000;
const server = http.createServer(app);

app.use(cors());
app.use(bodyParser.json());
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST"]
}));


// Start socket handler
socketHandler(server);

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


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

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
