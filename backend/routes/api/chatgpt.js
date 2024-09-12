const express = require("express");
const router = express.Router();
const pdfParse = require("pdf-parser");
const cors = require("cors");
const OpenAI = require("openai");
const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey,
});

const prompt = 'You are a master google "dork" researcher.  I will give you a prompt and you will respond with the most detailed targeted "dork" to get the most relevant results for '

router.post("/", async (req, res) => {
  const {query} = req.body
  try {

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: `${prompt} "${query}", only respond with the dork string` }],
      stream: false
    });

      const content = completion.choices[0].message;
      if (content) {
        console.log(content);
      }
  } catch (error) {
    console.log(error)
  }
  res.json()
});

module.exports = router;
