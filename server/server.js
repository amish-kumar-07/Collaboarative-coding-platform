import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import cors from "cors";

const app = express();

const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
