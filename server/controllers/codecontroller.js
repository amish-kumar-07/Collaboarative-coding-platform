const express = require('express');
const app = express();
app.use(express.json());

const { codexecutr } = require('../services/codexecutr');

body = { code: "console.log(x)", lang: "js", input: "x" }

const handleCodeExecution = async (req, res) => {
    // Extract the necessary values from the request body
    const { code, lang, input } = req.body;
    try {
        output = await codexecutr(code, lang, input);
        res.json({output});
    }
    catch (e) {
        res.json(e);
    }
}

app.post('/code-execute',handleCodeExecution);