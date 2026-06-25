const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", createProxyMiddleware({
  target: "http://4.224.186.213",
  changeOrigin: true,
  pathRewrite: { "^/auth": "/evaluation-service/auth" },
}));

app.use("/api", createProxyMiddleware({
  target: "http://4.224.186.213",
  changeOrigin: true,
  pathRewrite: { "^/api": "/evaluation-service" },
}));

app.listen(5000, () => console.log("Proxy running on port 5000"));