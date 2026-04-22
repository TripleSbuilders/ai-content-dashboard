import { execSync } from "node:child_process";
import path from "node:path";

const isRender = Boolean(process.env.RENDER) || Boolean(process.env.RENDER_SERVICE_ID);
const cacheDir = String(process.env.PUPPETEER_CACHE_DIR || "").trim() || path.resolve(process.cwd(), ".puppeteer-cache");

if (!isRender) {
  console.log("[puppeteer] Skipping browser install outside Render.");
  process.exit(0);
}

console.log(`[puppeteer] Installing Chrome for Render runtime into ${cacheDir} ...`);
execSync(`npx puppeteer browsers install chrome --path "${cacheDir}"`, { stdio: "inherit" });
console.log("[puppeteer] Chrome install complete.");

