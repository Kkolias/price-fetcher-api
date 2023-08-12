import axios from "axios";
import * as cheerio from "cheerio"; // Import Cheerio
import ShopItem from "../Schema/ShopItem";

const puppeteer = require("puppeteer");

const HTML_PRICE_PATH = {
  JIMMS: "JIMMS",
  VERKKO_KAUPPA: "VERKKO_KAUPPA",
  MASKU: "MASKU",
  POWER: "POWER",
  GIGANTTI: "GIGANTTI",
};

type Key = keyof typeof HTML_PRICE_PATH;

export async function createShopItem({
  name,
  link,
  key,
}: {
  name: string;
  link: string;
  key: Key;
}) {
  if (key === HTML_PRICE_PATH.VERKKO_KAUPPA)
    return createShopItemVerkkokauppa({
      name,
      link,
    });
  if (key === HTML_PRICE_PATH.MASKU)
    return createShopItemMasku({
      name,
      link,
    });
  if (key === HTML_PRICE_PATH.POWER)
    return createShopItemPower({
      name,
      link,
    });
  if (key === HTML_PRICE_PATH.GIGANTTI)
    return createShopItemGigantti({
      name,
      link,
    });

  const response = await axios.get(link);
  const $ = cheerio.load(response.data);

  const priceAsText = $(
    ".jim-product-cta-box-inner h1 span[itemprop='name']"
  ).text();
  const salePriceAsText = $(".price__amount span[itemprop='price']").attr(
    "content"
  );

  const priceNormal = priceAsText.split("Norm.")[1];
  const parsedPrice = parseFloat(priceNormal?.replace(",", ".") as string);
  const parsedSalePrice = parseFloat(
    salePriceAsText?.replace(",", ".") as string
  );

  const newItem = new ShopItem({
    name,
    link,
    priceList: [
      { date: new Date(), salePrice: parsedSalePrice, price: parsedPrice },
    ],
  });
  return newItem;
}

export async function createShopItemVerkkokauppa({
  name,
  link,
}: {
  name: string;
  link: string;
}) {
  const response = await axios.get(link);
  const $ = cheerio.load(response.data);

  const priceAsText = $(".Price-sc-1eckydb-2 data[data-price='previous']").attr(
    "value"
  );
  const priceDecimalAsText = $(
    ".Price-sc-1eckydb-2 data[data-price='previous']"
  ).attr("data-decimals");

  const parsedPrice = parseFloat(priceAsText as string);
  const parsedDecimal = parseFloat(priceDecimalAsText as string);
  const totalParsed = parsedPrice + parsedDecimal;

  const salePriceAsText = $(
    ".Price-sc-1eckydb-2 data[data-price='current']"
  ).attr("value");
  const salePriceDecimalAsText = $(
    ".Price-sc-1eckydb-2 data[data-price='current']"
  ).attr("data-decimals");

  const saleParsedPrice = parseFloat(salePriceAsText as string);
  const saleParsedDecimal = parseFloat(salePriceDecimalAsText as string);
  const saleTotalParsed = saleParsedPrice + saleParsedDecimal;


  const newItem = new ShopItem({
    name,
    link,
    priceList: [
      { date: new Date(), price: totalParsed, salePrice: saleTotalParsed },
    ],
  });
  return newItem;
}

export async function createShopItemMasku({
  name,
  link,
}: {
  name: string;
  link: string;
}) {
  const response = await axios.get(link);
  const $ = cheerio.load(response.data.trim());

  // HUOM KÄYTÄ TÄTÄ GIGANTTIIN JA POWERIIN
  //   const testi = response.data.trim()
  //   console.log(testi)
  const priceAsText = $(".price").text();
  const salePriceAsText = $(".list_price").text();
  const parsedPrice = parseFloat(priceAsText?.replace(",", ".") as string);
  const saleParsedPrice = parseFloat(
    salePriceAsText?.replace(",", ".") as string
  );

  const newItem = new ShopItem({
    name,
    link,
    priceList: [
      { date: new Date(), price: parsedPrice, salePrice: saleParsedPrice },
    ],
  });
  return newItem;
}

export async function createShopItemPower({
  name,
  link,
}: {
  name: string;
  link: string;
}) {

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36"
  );
  await page.goto(link);


  const salePriceElement = await page.$("pwr-product-price-savings-label div");

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

  const newItem = new ShopItem({
    name,
    link,
    priceList: [
      { date: new Date(), price: (numberPrice + numberSalePrice), salePrice: numberPrice },
    ],
  });
  return newItem;
}

export async function createShopItemGigantti({
  name,
  link,
}: {
  name: string;
  link: string;
}) {

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36"
  );
  await page.goto(link);

  // Extract price using a selector
  // const t = await page.content();
  // console.log(t);

  const priceElement = await page.$(".price--200 span");
  const salePriceElement = await page.$(
    ".price__old-value .price__old-value--contents span"
  );
  if (priceElement) {
    const priceText = await priceElement.evaluate(
      (element) => element.textContent
    );
    console.log("Price:", priceText.trim());
  } else {
    console.log("Price element not found");
  }
  if (salePriceElement) {
    const salePriceText = await salePriceElement.evaluate(
      (element) => element.textContent
    );
    console.log("Price:", salePriceText.trim());
  } else {
    console.log("Price element not found");
  }

  await browser.close();

  const newItem = new ShopItem({
    name,
    link,
    priceList: [{ date: new Date(), price: 0, salePrice: 0 }],
  });
  return newItem;
}
