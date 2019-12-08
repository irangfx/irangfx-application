const puppeteer = require("puppeteer");

(async () => {
	const browser = await puppeteer.launch({ headless: false });
	const page = await browser.newPage();

	await page.goto("https://irangfx.com/login-users/?loggedout=true");

	await page.type("#user_login", "sadegh007shams@gmail.com");
	await page.type("#user_pass", "sadegh1380");
	await page.click("#wp-submit");

	await page.goto("https://irangfx.com/wp-admin/post-new.php");

	await page.screenshot({ path: "example.png" });

	await browser.close();
})();
