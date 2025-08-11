// This line loads environment variables from a .env file,
// including your API key, which is kept separate for security.
require('dotenv').config();

// We import the necessary libraries:
// - @google/generative-ai to talk to the Gemini API
// - express to create our web server
const { GoogleGenerativeAI } = require('@google/generative-ai');
const express = require('express');

// The code now securely retrieves your API key from the environment variable.
const API_KEY = process.env.GOOGLE_API_KEY;
if (!API_KEY) {
  console.error("API_KEY not found. Please set GOOGLE_API_KEY in your .env file.");
  process.exit(1);
}

// We initialize the Gemini API with your key.
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// We set up our web server.
const app = express();
const port = 3000;

app.use(express.json());

// This is the endpoint for making API calls.
app.post('/generate', async (req, res) => {
  try {
    const prompt = req.body.prompt;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required in the request body." });
    }

    // We send your prompt to the Gemini model and get a response.
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // We send the generated text back as a JSON response.
    res.json({ generatedText: text });
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ error: 'Failed to generate content.' });
  }
});

// We start the server and tell it to listen for requests.
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

