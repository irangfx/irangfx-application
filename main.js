import puppeteer from "puppeteer";
import data from "./data";
require("dotenv").config();

(async () => {
	const browser = await puppeteer.launch({ headless: false });
	const page = await browser.newPage();

	await page.goto("https://irangfx.com/login-users/?loggedout=true");

	await page.type("#user_login", process.env.USERNAME);
	await page.type("#user_pass", process.env.PASSWORD);
	await page.click("#wp-submit");

	await page.goto("https://irangfx.com/wp-admin/post-new.php", {
		timeout: 0
	});

	await page.type("#title-prompt-text", `${data.title_fa} - ${data.title_en}`);
	await page.click("a[href='#edit_timestamp'].edit-timestamp");
	await page.select("#Jmm]", data.schedule.month);
	await page.type("#Jjj", data.schedule.month);
	await page.type("#Jaa", data.schedule.month);
	await page.type("#Jmn", data.schedule.minus);
	await page.type("#Jhh", data.schedule.hour);
	await page.click("a[href='#edit_timestamp'].save-timestamp");
	await page.click("#save-post");

	// await browser.close();
})();
