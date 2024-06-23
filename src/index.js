const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const {performance} = require('perf_hooks');

/**
 * Generate static HTML files from a list of URLs.
 * @param {Array<string>} urls - Array of URLs to process.
 * @param {string} outputDir - Directory to save generated HTML files.
 * @param {number} [timeout=60000] - Navigation timeout in milliseconds.
 * @param {number} [retries=3] - Number of retry attempts on failure.
 */
async function generateStaticSite(urls, outputDir, timeout = 60000, retries = 3) {

    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    for (const url of urls) {
        try {

            let loadTime = 0

            await retry(async () => {

                console.log(`Open: ${url}`);
                const startTime = performance.now();
                await page.goto(url, {waitUntil: 'networkidle2', timeout});
                const endTime = performance.now();
                loadTime = ((endTime - startTime) / 1000).toFixed(2);

            }, retries);

            // Save HTML
            const html = await page.content();
            const urlPath = new URL(url).pathname;
            const savePath = path.join(outputDir, urlPath);
            const saveFilePath = path.join(savePath, 'index.html');
            fs.mkdirSync(savePath, {recursive: true});
            fs.writeFileSync(saveFilePath, html);

            console.log(`Saved: ${saveFilePath} \x1b[32m(Load time: ${loadTime} seconds)\x1b[0m`);
        } catch (error) {
            console.error(`Failed to save: ${url}`, error);
        }
    }

    await browser.close();
}

async function retry(fn, retriesLeft = 5, interval = 1000) {
    try {
        await fn();
    } catch (error) {
        if (retriesLeft === 1) throw error;
        console.log(`Retrying... attempts left: ${retriesLeft - 1}`);
        await new Promise(r => setTimeout(r, interval));
        await retry(fn, retriesLeft - 1, interval);
    }
}

module.exports = generateStaticSite;
