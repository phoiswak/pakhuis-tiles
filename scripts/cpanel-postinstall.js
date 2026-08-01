/**
 * Runs after npm install.
 * On EliteHost (pakhuis-app path), also push DB + build Next.js
 * so deploy works without cPanel Terminal.
 */
const { execSync } = require("child_process");
const path = require("path");

function run(cmd) {
  console.log(`> ${cmd}`);
  execSync(cmd, { stdio: "inherit", env: process.env });
}

const cwd = process.cwd().replace(/\\/g, "/");
const onCpanel =
  cwd.includes("/home/pakhuisc/pakhuis-app") ||
  process.env.CPANEL_BUILD === "1";

run("npx prisma generate");

if (!onCpanel) {
  console.log("Local install: skipping DB push / Next build.");
  process.exit(0);
}

console.log("cPanel detect: running DB setup + production build...");
run("npx prisma db push");
try {
  run("npx tsx prisma/seed.ts");
} catch {
  console.warn("Seed skipped or failed (OK if DB already seeded).");
}
run("npx next build");
console.log("cPanel postinstall complete.");
