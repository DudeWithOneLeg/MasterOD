const express = require("express");
require("express-async-errors");
const morgan = require("morgan");
const cors = require("cors");
const csurf = require("csurf");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const routes = require("./routes");
const { ValidationError } = require("sequelize");
const http = require("http");
const OpenAI = require("openai");
const pdfParse = require("pdf-parse");
const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey,
});

const { environment } = require("./config");
const app = express();
const server = http.createServer(app);

// const io = require("socket.io")(server, {
//   cors: {
//     origin: `https://linque.onrender.com`,
//     methods: ["GET", "POST"],
//   },
// });

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});



io.on("connection", (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join', (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room ${room}`);
  });

  socket.on('message', async message => {
    try {

      const stream = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [{ role: "user", content: `${message}` }],
        stream: true,
        maxTokens: 2000
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          socket.emit("message", content);
          console.log(content);
        }
      }
      socket.emit('end', "stream finished")
    } catch (error) {
      console.log(error)
    }
  })

  socket.on("url", async ({ url }) => {
    console.log(`Processing URL: ${url}`);
    socket.to(1).emit('connected', 'hiii');

    try {
      const res = await fetch(url);
      if (res.status === 200) {
        const data = await res.arrayBuffer();
        const pdfBuffer = Buffer.from(data);
        const pdfData = await pdfParse(pdfBuffer);
        const text = pdfData.text.split("\n\n").filter(word => word !== "" && word !== "\n").join("").split('').slice(0, 30000).join('')
        // console.log(text)
        if (text) {

          const stream = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [{ role: "user", content: `analyze this "${text}"` }],
            stream: true,
          });

          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              socket.emit("response", content);
              // console.log(content);
            }
          }
          socket.emit("end", "Stream finished");
        }

      }
    } catch (error) {
      console.error("Error processing URL or streaming GPT response:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log('User disconnected:', socket.id);
  });
});
const isProduction = environment === "production";

app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());

// Security Middleware
if (!isProduction) {
  // enable cors only in development
  app.use(cors());
}

// helmet helps set a variety of headers to better secure your app
app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin",
  })
);

// Set the _csrf token and create req.csrfToken method
app.use(
  csurf({
    cookie: {
      secure: isProduction,
      sameSite: isProduction && "Lax",
      httpOnly: true,
    },
  })
);

app.use(routes);

app.use((_req, _res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  err.title = "Resource Not Found";
  err.errors = { message: "The requested resource couldn't be found." };
  err.status = 404;
  next(err);
});

app.use((err, _req, _res, next) => {
  // check if error is a Sequelize error:
  if (err instanceof ValidationError) {
    let errors = {};
    for (let error of err.errors) {
      errors[error.path] = error.message;
    }
    err.title = "Validation error";
    err.errors = errors;
  }
  next(err);
});

app.use((err, _req, res, _next) => {
  res.status(err.status || 500);
  console.error(err);
  res.json({
    title: err.title || "Server Error",
    message: err.message,
    errors: err.errors,
    stack: isProduction ? null : err.stack,
  });
});

module.exports = server;
