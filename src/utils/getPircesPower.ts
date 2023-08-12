const puppeteer = require("puppeteer");

export class GetPricesPower {
  async execute(link) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36"
    );
    await page.goto(link);

    const salePriceElement = await page.$(
      "pwr-product-price-savings-label div"
    );

    const salePriceText = await salePriceElement.evaluate(
      (element) => element.textContent
    );
    const parsedSalePrice = salePriceText
      .split("Säästä")[1]
      .replace("€", "")
      .replace("*", "");
    const numberSalePrice = parseFloat(parsedSalePrice);

    const priceElement = await page.$("pwr-price[type='integer']");

    const priceText = await priceElement.evaluate(
      (element) => element.textContent
    );
    const numberPrice = parseFloat(priceText);
    return { price: numberPrice + numberSalePrice, salePrice: numberPrice };
  }
}
