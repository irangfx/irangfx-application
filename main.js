const puppeteer = require("puppeteer");
require('dotenv').config();

(async () => {
	const browser = await puppeteer.launch({ headless: false });
	const page = await browser.newPage();

	await page.goto("https://irangfx.com/login-users/?loggedout=true");

	await page.type("#user_login", process.env.USERNAME);
	await page.type("#user_pass", process.env.PASSWORD);
	await page.click("#wp-submit");

	await page.goto("https://irangfx.com/wp-admin/post-new.php");

	await page.screenshot({ path: "example.png" });

	await browser.close();
})();
