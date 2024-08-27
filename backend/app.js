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
const { createProxyMiddleware } = require('http-proxy-middleware');
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

// Function to determine the target dynamically


app.use('/proxy', async (req, res, next) => {
  // Determine the target URL based on request path or other criteria
  console.log(req.url)
  req.targetUrl = new URL(req.url.split('').slice(1).join('')); // Default target

  if (req.path.startsWith('/service1')) {
    req.targetUrl = 'https://service1.example.com';
  } else if (req.path.startsWith('/service2')) {
    req.targetUrl = 'https://service2.example.com';
  }

  // Proceed to the next middleware (proxy middleware)
  next();
});

// Proxy middleware
app.use(
  '/proxy',
  async (req, res, next) => {
    // Use the target URL set by the custom middleware
    const target = req.targetUrl;

    createProxyMiddleware({
      target: target,
      changeOrigin: true,
      pathRewrite: {
        '^/': '', // Remove /proxy from the request path
      },
      onProxyReq: (proxyReq, req, res) => {
        // Set headers to mimic a browser
        proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        proxyReq.setHeader('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8');
        proxyReq.setHeader('Accept-Language', 'en-US,en;q=0.9');
        proxyReq.setHeader('Accept-Encoding', 'gzip, deflate, br');
        proxyReq.setHeader('Connection', 'keep-alive');
        proxyReq.setHeader('Upgrade-Insecure-Requests', '1');
        // Optionally, you can forward cookies or other headers if needed
        // proxyReq.setHeader('Cookie', req.headers.cookie || '');
      },
      onProxyRes: (proxyRes) => {
        console.log('Received response with status:', proxyRes.statusCode);
      },
      onError: (err, req, res) => {
        console.error('Proxy error:', err);
        res.status(500).send('Proxy error');
      },
    })(req, res, next);
  }
);

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
