const express = require("express");
const router = express.Router();
const OpenAI = require("openai");
const pdfParse = require("pdf-parser");
const cors = require("cors");
const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey,
});

router.get("/test", async (req, res) => {
//   const { url } = req.params;
//   console.log(url)
// //   const response = await fetch(url)
//     .then(async (res) => {
//     //   if (res.status == 200) {
//     //     return res.arrayBuffer(); // Get the reader for the response body
//     //   }
//     })
//     .then( (data) => {
//       const pdfBuffer = Buffer.from(data)

//     //   pdfParse(pdfBuffer).then( async (datat) => {
//     //     return datat.text
//     //     // console.log(data.text.split("\n\n"));
//     //     // console.log(data.info);
//     //     // console.log((pdf.length / 1024 / 1024).toFixed(2) + " MB");
//     //   });
//     });
//     try {
//         const stream = await openai.chat.completions.create({
//           model: "gpt-4",
//           messages: [{ role: "user", content: `analyze this "${response}"` }],
//           stream: true,
//         });

//         for await (const chunk of stream) {
//           const content = chunk.choices[0]?.delta?.content || "";
//           if (content) {
//             rsock(`data: ${content}\n\n`);
//           }
//         }

//         res.end();
//       } catch (error) {
//         console.error("Error streaming GPT response:", error);
//         res.status(500).send("Error streaming GPT response");
//       }
});

module.exports = router;
