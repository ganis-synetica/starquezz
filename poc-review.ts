import { chromium } from "playwright";

const URL = process.env.POC_URL || "http://localhost:4173";
const ROUND = process.env.ROUND || "1";

async function main() {
  const browser = await chromium.launch();

  // Mobile screenshot
  const mobilePage = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
  });
  await mobilePage.goto(URL, { waitUntil: "networkidle" });
  await mobilePage.waitForTimeout(1500); // let fonts + animations settle
  await mobilePage.screenshot({
    path: `/tmp/poc-round${ROUND}-mobile.png`,
    fullPage: true,
  });
  console.log(`Mobile screenshot saved: /tmp/poc-round${ROUND}-mobile.png`);

  // Desktop screenshot
  const desktopPage = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  await desktopPage.goto(URL, { waitUntil: "networkidle" });
  await desktopPage.waitForTimeout(1500);
  await desktopPage.screenshot({
    path: `/tmp/poc-round${ROUND}-desktop.png`,
    fullPage: true,
  });
  console.log(`Desktop screenshot saved: /tmp/poc-round${ROUND}-desktop.png`);

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
