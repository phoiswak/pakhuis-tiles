/**
 * EliteHost / cPanel Node.js Selector startup file.
 * Application startup file should be set to: server.js
 *
 * CloudLinux symlinks node_modules into nodevenv — Turbopack cannot
 * build there, so we use `next build --webpack` on first start.
 */
try {
  require("dotenv").config({ path: ".env.production" });
  require("dotenv").config();
} catch {
  /* dotenv optional if env vars come from cPanel */
}

const { existsSync } = require("fs");
const { execSync } = require("child_process");
const { createServer } = require("http");
const { parse } = require("url");

function run(cmd) {
  console.log(`> ${cmd}`);
  execSync(cmd, { stdio: "inherit", env: process.env });
}

if (!existsSync(".next")) {
  console.log("No .next build found — building with webpack (first start)...");
  run("npx prisma generate");
  try {
    run("npx prisma db push");
  } catch (e) {
    console.warn("prisma db push failed:", e.message || e);
  }
  // Skip seed on cPanel (tsx path resolution is flaky under nodevenv)
  run("npx next build --webpack");
  console.log("Build finished.");
}

const next = require("next");
const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Pakhuis Tiles ready on port ${port}`);
  });
});
