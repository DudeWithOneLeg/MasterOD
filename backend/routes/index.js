
const express = require('express')
const router = express.Router()
const apiRouter = require('./api');
const {createProxyMiddleware} =require('http-proxy-middleware')


router.use('/api', apiRouter);

const path = require('path');
if (process.env.NODE_ENV === 'production') {
  // Serve the frontend's index.html file at the root route
  router.get('/', (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    if (!req.path.includes('/proxy')) {
      return res.sendFile(
        path.resolve(__dirname, '../../frontend', 'build', 'index.html')
      );

    }
  });

  // Serve the static assets in the frontend's build folder
  router.use(express.static(path.resolve("../frontend/build")));

  // Serve the frontend's index.html file at all other routes NOT starting with /api
  router.get(/^(?!\/?api).*/, (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    if (!req.path.includes('/proxy')) {
      return res.sendFile(
        path.resolve(__dirname, '../../frontend', 'build', 'index.html')
      );

    }
  });
}

// router.use('/proxy', async (req, res, next) => {
//   // Determine the target URL based on request path or other criteria
//   console.log('PROXXXYYYYYYYYYYYYYYYYYYYYYYY'+req.url)
//   req.targetUrl = new URL(req.url.split('').slice(1).join('')); // Default target

//   if (req.path.startsWith('/service1')) {
//     req.targetUrl = 'https://service1.example.com';
//   } else if (req.path.startsWith('/service2')) {
//     req.targetUrl = 'https://service2.example.com';
//   }

//   // Proceed to the next middleware (proxy middleware)
//   next();
// });

// Proxy middleware
// router.use(
//   '/proxy',
//   async (req, res, next) => {
//     // Use the target URL set by the custom middleware
//     const target = req.targetUrl;

//     createProxyMiddleware({
//       target: target,
//       changeOrigin: true,
//       pathRewrite: {
//         '^/': '', // Remove /proxy from the request path
//       },
//       onProxyReq: (proxyReq, req, res) => {
//         // Set headers to mimic a browser
//         proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
//         proxyReq.setHeader('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8');
//         proxyReq.setHeader('Accept-Language', 'en-US,en;q=0.9');
//         proxyReq.setHeader('Accept-Encoding', 'gzip, deflate, br');
//         proxyReq.setHeader('Connection', 'keep-alive');
//         proxyReq.setHeader('Upgrade-Insecure-Requests', '1');
//         // Optionally, you can forward cookies or other headers if needed
//         // proxyReq.setHeader('Cookie', req.headers.cookie || '');
//       },
//       onProxyRes: (proxyRes) => {
//         console.log('Received response with status:', proxyRes.statusCode);
//       },
//       onError: (err, req, res) => {
//         console.error('Proxy error:', err);
//         res.status(500).send('Proxy error');
//       },
//     })(req, res, next);
//   }
// );

if (process.env.NODE_ENV !== 'production') {
  // router.get(/^(?!\/?proxy).*/, (req, res) => {
  //   // res.cookie('XSRF-TOKEN', req.csrfToken());
  //   console.log('hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii')
  //   if (req.path.includes('/proxy')) {
  //     next()

  //   }
  // })
  router.get('/api/csrf/restore', (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    return res.json({});
  });
}

module.exports = router;
