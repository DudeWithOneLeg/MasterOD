import { useState, useEffect } from "react";
import pdfToText from 'react-pdftotext'
import OpenAI from "openai";
const apiKey = process.env.REACT_APP_OPENAI_API_KEY

const openai = new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true
});

export default function GptDocAnalyze({ url }) {
  const [messages, setMessages] = useState([
    { role: "user", content: "Analayze this document" },
  ]);

  const gptResponse = async (userMessage) => {
    const newMessage = {
      role: "user",
      content: userMessage,
    };
    const stream = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [...messages, newMessage],
      stream: true,
    });
    for await (const chunk of stream) {
      console.log(chunk.choices[0]?.delta?.content || "");
    }
  };

  const extractText = async () => {
    await fetch(`https://web.archive.org/web/20240000000000/https://historycollection.jsc.nasa.gov/JSCHistoryPortal/history/mission_trans/GT03_TEC.PDF`)
      .then(async (res) => {
        if (res.status == 200) {
          return res.blob(); // Get the reader for the response body
        }
      })
      .then(async (data) => {
        pdfToText(data)
          .then(async (text) => {
            console.log(text)
            await gptResponse(
              text
            );
          })
          .catch((error) => console.error("Failed to extract text from pdf"));
      });
  };

  useEffect(() => {
    extractText();
  }, []);

  return <div className="w-full h-full"></div>;
}
