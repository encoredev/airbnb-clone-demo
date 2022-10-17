const puppeteer = require("puppeteer");

const tags = {
  arctic: "Tag%3A8534",
  farm: "Tag%3A7769",
  beach: "Tag%3A7769",
  lakefront: "Tag%3A8522",
  cabin: "Tag%3A5348",
  omg: "Tag%3A8225",
  tiny_home: "Tag%3A8186",
  a_frame: "Tag%3A8148",
  camper: "Tag%3A8166",
  design: "Tag%3A8528",
  amazing_pool: "Tag%3A677",
};

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--window-size=1920,1080"],
    defaultViewport: { width: 1920, height: 1080 },
  });
  const page = await browser.newPage();

  for (const [tag, tagID] of Object.entries(tags)) {
    await page.goto("https://airbnb.com/?category_tag=" + tagID);

    // Wait for suggest overlay to appear and click "show all results".
    const resultsSelector = "div[itemprop=itemListElement]";
    await page.waitForSelector(resultsSelector);

    await delay(1000); // wait for everything to load

    const sels = await page.$$(resultsSelector);

    for (const res of sels) {
      const titleID = await res.$eval("div[aria-labelledby]", (el) =>
        el.getAttribute("aria-labelledby")
      );
      const locationElem = await page.$("#" + titleID);

      // Scroll it into view
      await page.$eval("#" + titleID, (el) => el.scrollIntoView());

      // Hover the carousel
      await (
        await res.$('div[aria-describedby="carousel-description"]')
      ).hover();
      await delay(500);

      // Click the next photo button
      await (await res.$('button[aria-label="Next photo"]')).click();
      await delay(500);

      const name = await attr(await res.$("meta[itemprop=name]"), "content");

      const distanceElem = await next(page, locationElem);
      const pricePerNightParent = await next(
        page,
        await next(page, distanceElem)
      );
      const pricePerNightElem = await pricePerNightParent.$(
        "div > div > span > div > span"
      );

      const imageURLs = await Promise.all(
        [...(await res.$$("picture > img"))].map((img) => attr(img, "src"))
      );

      const location = await attr(locationElem, "textContent");
      const distance = await attr(distanceElem, "textContent");
      const pricePerNight = await attr(pricePerNightElem, "textContent");
      console.log(
        JSON.stringify({
          name,
          location,
          distance,
          pricePerNight,
          imageURLs,
          tag,
        })
      );
    }
  }

  await browser.close();
})();

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

function next(page, last) {
  return page.evaluateHandle((el) => el.nextSibling, last);
}

async function attr(el, name) {
  return await (await el.getProperty(name)).jsonValue();
}
