import puppeteer from "puppeteer";
import axios from 'axios';
import data from "./data";
require("dotenv").config();

const delay = 10;

(async () => {

	const browser = await puppeteer.launch({ headless: false });
	const page = await browser.newPage();
	await page.setViewport({ width: 800, height: 1000 });

	// await optimizeSpeed(page);
	await prepareLogin(page);

	await page.goto("https://irangfx.com/wp-admin/post-new.php", { timeout: 0 });

	await preparePostTitle(page);
	await preparePostLink(page);
	await preparePostSchedule(page);
	await preparePostSlug(page);
	await preparePostPremium(page);
	await preparePostSoftware(page);
	await preparePostTags(page);

	// await page.click("#save-post");
	// await browser.close();
})();

async function getFileSize(url) {
	const { headers } = await axios.head(url);
	return (Math.round(headers['content-length'] / 1048576 * 100) / 100).toString();
}

async function optimizeSpeed(page) {
	await page.setRequestInterception(true);
	page.on("request", request => {
		if (["font", "stylesheet"].includes(request.resourceType())) {
			request.abort();
		} else {
			request.continue();
		}
	});
}

async function prepareLogin(page) {
	await page.goto("https://irangfx.com/login-users/");

	while ((await page.url()) !== "https://irangfx.com/wp-admin/") {
		await typeValue(page, "#user_login", process.env.USERNAME);
		await typeValue(page, "#user_pass", process.env.PASSWORD);
		await page.click("#wp-submit");
	}
}

async function preparePostTags(page) {
	await typeValue(page, "#new-tag-post_tag", data.tags.join(","));
	await page.click("input.button.tagadd");
}

async function preparePostSoftware(page) {
	await typeValue(
		page,
		"#acf-field_5c04d5eb6d4fd",
		`Download ${data.title_en}`
	);

	if (data.formats.includes("PSD")) {
		await page.click(".acf-field-5d18689195c43 ul>li:nth-child(1)");
	}
	if (data.formats.includes("AI")) {
		await page.click(".acf-field-5d18689195c43 ul>li:nth-child(2)");
	}
	if (data.price)
		await page.type("#acf-field_5c04d83864846", data.price, { delay });
	for (const format of data.formats)
		await page.click(`.acf-field-5c04d88e64847 input[value=${format}]`);
	if (data.formats.includes("PDF")) {
		await page.click(".acf-field-5c04d5eb6daee ul>li:first-child input");
	} else {
		await page.click(".acf-field-5c04d5eb6daee ul>li:last-of-type input");
	}
}

async function preparePostPremium(page) {
	if (data.premium) {
		await page.click("#acf-field_5c04db456484a-کاربران-ویژه");
	} else {
		await page.click("#post-format-gallery");
		await page.click("#acf-field_5c04db456484a-همه");
	}
}

async function preparePostSlug(page) {
	await page.waitForSelector(".edit-slug.button");
	await page.click(".edit-slug.button");

	await typeValue(page, "#new-post-slug", data.title_en);

	await page.waitForSelector("#edit-slug-buttons button.save");
	await page.click("#edit-slug-buttons button.save");
}

async function typeValue(page, selector, value) {
	const searchInput = await page.$(selector);
	await searchInput.click({ clickCount: 3 });
	await searchInput.press("Backspace");
	await searchInput.type(value);
}

async function preparePostTitle(page) {
	await page.type("#title-prompt-text", `${data.title_fa} - ${data.title_en}`, {
		delay
	});
}

async function preparePostLink(page) {
	const divId = data.premium
		? "#acf-group_5c6e46d5c157e"
		: "#acf-group_5c6e4b864d8b3";

	for (const [index, link] of data.links.entries()) {
		if (index > 0) await page.click(`${divId} .acf-actions a.acf-button`);
		await page.click(`${divId} tbody tr:nth-child(${index + 1}) a.button`);
		await page.waitForSelector("#link-options");
		const url = link.replace(
			"/domains/pz10448.parspack.net/public_html",
			"https://dl.irangfx.com"
		);

		await typeValue(page, "#wp-link-url", url);
		await typeValue(page, "#wp-link-text", "دانلود این موکاپ");
		await page.click("#wp-link-target");
		await page.click("#wp-link-update");
		await typeValue(page, `${divId} tbody tr:nth-child(${index + 1}) .acf-field.acf-field-text input`, await getFileSize(url));
	}
}

async function preparePostSchedule(page) {
	await page.click("a[href='#edit_timestamp'].edit-timestamp");
	await page.select("#Jmm", data.schedule.month);
	await typeValue(page, "#Jjj", data.schedule.day);
	await typeValue(page, "#Jaa", data.schedule.year);
	await typeValue(page, "#Jmn", data.schedule.minus);
	await typeValue(page, "#Jhh", data.schedule.hour);
	await page.click("a[href='#edit_timestamp'].save-timestamp");
}
