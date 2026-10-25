import { chromium, firefox, webkit, devices } from 'playwright';

const url = process.env.URL || 'https://google.com';

const screenshotValues = {
	control: {
		chromium: [2560, 1440, 768, 360],
	},
	variant: {
		chromium: [2560, 1440, 768, 360],
		firefox: [2560, 1440],
		webkit: [2560, 1440],
		msedge: [2560, 1440],
		devices: [
			'Pixel 10',
			'iPhone 17 Pro',
			'iPad Pro 11',
			'iPad Pro 11 landscape',
		],
	},
};

async function takeScreenshot(key, browser, values, url) {
	for (const value of values) {
		let device, page, context;
		if (Number.isInteger(value)) {
			context = await browser.newContext();
			page = await context.newPage();
			await page.setViewportSize({ width: value, height: 900 });
		} else {
			device = devices[value];
			context = await browser.newContext({ ...device });
			page = await context.newPage();
		}
		await page.goto(url, { waitUntilL: 'networkidle' });
		//Add custom function below here
		additionalSteps(browser, page);
		await page.screenshot({
			path: './screenshots/' + `${key}_${value}_` + 'screenshot.png',
			fullPage: true,
		});
	}
	await browser.close();
}

let browser;
async function browserInvoke() {
	const options = { headless: true };
	for (const [key, values] of Object.entries(screenshotValues.variant)) {
		if (key === 'msedge') {
			browser = await chromium.launch({
				channel: 'msedge',
				headless: false,
			});
		} else if (key === 'devices') {
			if (key.includes('iPhone') || key.includes('iPad'))
				browser = await webkit.launch(options);
			else browser = await chromium.launch(options);
		} else if (key === 'chromium') browser = await chromium.launch(options);
		else if (key === 'firefox') browser = await firefox.launch(options);
		else if (key === 'webkit') browser = await webkit.launch(options);

		takeScreenshot(key, browser, values, url);
	}
}

function additionalSteps() {
	return;
}

browserInvoke();
