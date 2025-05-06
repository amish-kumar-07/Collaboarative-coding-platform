const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const { initSocket } = require("./socket/socketHandler");
const { codexecution, checkStatus } = require("./services/codeexectution");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());


const server = app.listen(3001, () => {
  console.log("Server is running at http://localhost:3001 for WebSockets");
});

console.log(initSocket);  // Should log a function definition if imported correctly
initSocket(server);


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
