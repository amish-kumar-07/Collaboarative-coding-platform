const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Predefined questions
const questions = [
  {
    id: 1,
    title: "Sum of Two Numbers",
    description: "Write a function that returns the sum of two numbers.",
    input: "3 5",
    output: "8",
  },
  {
    id: 2,
    title: "Reverse a String",
    description: "Write a function that reverses a given string.",
    input: "hello",
    output: "olleh",
  },
  {
    id: 3,
    title: "Find Maximum Number",
    description: "Write a function that returns the maximum of three numbers.",
    input: "7 2 9",
    output: "9",
  },
  {
    id: 4,
    title: "Check Palindrome",
    description:
      "Write a function that checks if a string is a palindrome (reads the same forwards and backwards). Return 'Yes' or 'No'.",
    input: "madam",
    output: "Yes",
  },
  {
    id: 5,
    title: "Factorial Calculation",
    description: "Write a function that returns the factorial of a given number.",
    input: "5",
    output: "120",
  },
  {
    id: 6,
    title: "Count Vowels",
    description: "Write a function that counts the number of vowels in a given string.",
    input: "Perplexity",
    output: "3",
  },
];

// Function to execute the code via Judge0 API and get the token
const codexecution = async (code, language_id, questionid) => {
  const qosan = questions.find((q) => q.id === parseInt(questionid));

  if (!qosan) {
    throw new Error("Question not found");
  }

  const payload = {
    source_code: code,
    language_id: language_id,
    stdin: qosan.input,
    expected_output: qosan.output,
  };

  try {
    const response = await axios.post(
      "https://judge0-ce.p.rapidapi.com/submissions",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          "X-RapidAPI-Key": "834ae508fdmshefa135bec82daeap14d1eOjsnf709d73200de", // Use your actual API key
        },
      }
    );
    return response.data.token; // This returns the submission token
  } catch (error) {
    console.error("Error while executing code:", error);
    throw new Error("Execution failed");
  }
};

// Function to check the status of the submission using the token
const checkStatus = async (token) => {
  try {
    const response = await axios.get(
      `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
      {
        headers: {
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          "X-RapidAPI-Key": "a735b7febamsh1c15929d46ea261p1d0159jsn543e1d05f9f4", 
        },
      }
    );
    return response.data; 
  } catch (error) {
    console.error("Error while checking status:", error);
    throw new Error("Failed to check status");
  }
};


app.post("/submit", async (req, res) => {
  const { code, language_id, questionid } = req.body;

  try {
    
    const qosan = questions.find((q) => q.id === parseInt(questionid));
    if (qosan) {
      
      const token = await codexecution(code, language_id, questionid);

    
      const judgeResult = await checkStatus(token);

      
      res.json({
        question: qosan,
        judgeResult: judgeResult,
      });
    } else {
      res.status(404).json({ error: "Question not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


const port = 5000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
