import { execSync } from "node:child_process";

const isRender = Boolean(process.env.RENDER) || Boolean(process.env.RENDER_SERVICE_ID);

if (!isRender) {
  console.log("[puppeteer] Skipping browser install outside Render.");
  process.exit(0);
}

console.log("[puppeteer] Installing Chrome for Render runtime...");
execSync("npx puppeteer browsers install chrome", { stdio: "inherit" });
console.log("[puppeteer] Chrome install complete.");

