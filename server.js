const express = require("express");
const next = require("next");
const { createProxyMiddleware } = require("http-proxy-middleware");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(
    "/endPoint",
    createProxyMiddleware({
      target: "https://gateway.pinata.cloud/ipfs",
      changeOrigin: true,
    })
  );

  server.use(
    "/endPoint",
    createProxyMiddleware({
      target: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      changeOrigin: true,
    })
  );

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
