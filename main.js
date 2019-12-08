import puppeteer from "puppeteer";
import data from "./data";
require("dotenv").config();

// function optimizeSpeed(params) {
// 	await page.setRequestInterception(true);
// 	page.on('request', request => {
// 		if (['font'].includes(request.resourceType())) {
// 			request.abort();
// 		} else {
// 			request.continue();
// 		}
// 	});
// }

(async () => {
	const browser = await puppeteer.launch({ headless: false });
	const page = await browser.newPage();

	await page.setViewport({ width: 800, height: 1000 });

	await page.goto("https://irangfx.com/login-users/?loggedout=true");

	await page.type("#user_login", process.env.USERNAME);
	await page.type("#user_pass", process.env.PASSWORD);
	await page.click("#wp-submit");

	await page.goto("https://irangfx.com/wp-admin/post-new.php", {
		timeout: 0
	});

	await preparePostTitle(page);
	await preparePostLink(page);
	await preparePostSchedule(page);
	await preparePostSlug(page);

	if (data.premium) {
		await page.click("#acf-field_5c04db456484a-کاربران-ویژه");
	} else {
		await page.click("#post-format-gallery");
		await page.click("#acf-field_5c04db456484a-همه");
	}

	if (data.formats.includes("PSD")) {
		await page.click(".acf-field-5d18689195c43 ul>li:nth-child(1)");
	}
	if (data.formats.includes("AI")) {
		await page.click(".acf-field-5d18689195c43 ul>li:nth-child(2)");
	}

	if (data.price) await page.type("#acf-field_5c04d83864846", data.price);

	// await page.click("#save-post");
	// await browser.close();
})();

async function preparePostSlug(page) {
	await page.waitForSelector(".edit-slug.button");
	await page.click(".edit-slug.button");
	await page.type("#new-post-slug", data.title_en);
	await page.click("#edit-slug-buttons button.save");
}

async function preparePostTitle(page) {
	await page.type("#title-prompt-text", `${data.title_fa} - ${data.title_en}`);
	await page.click("a[href='#edit_timestamp'].edit-timestamp");
}

async function preparePostLink(page) {
	const divId = data.premium
		? "#acf-group_5c6e46d5c157e"
		: "#acf-group_5c6e4b864d8b3";

	for (const [index, link] of data.links.entries()) {
		if (index > 0) await page.click(`${divId} .acf-actions a.acf-button`);
		await page.click(`${divId} tbody tr:nth-child(${index + 1}) a.button`);
		await page.waitForSelector("#link-options");
		await page.type(
			"#wp-link-url",
			link.replace(
				"/domains/pz10448.parspack.net/public_html",
				"https://dl.irangfx.com"
			)
		);
		await page.type("#wp-link-text", "دانلود این موکاپ");
		await page.click("#wp-link-target");
		await page.click("#wp-link-update");
	}
}

async function preparePostSchedule(page) {
	await page.select("#Jmm", data.schedule.month);
	await page.type("#Jjj", data.schedule.month);
	await page.type("#Jaa", data.schedule.month);
	await page.type("#Jmn", data.schedule.minus);
	await page.type("#Jhh", data.schedule.hour);
	await page.click("a[href='#edit_timestamp'].save-timestamp");
}
