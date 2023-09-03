import axios from "axios";
import * as cheerio from "cheerio"; // Import Cheerio
import { getPriceAsNumber } from "./price.utils";

export class GetPricesJimms {
  async execute(link) {
    const response = await axios.get(link);
    const $ = cheerio.load(response.data);

    const priceAsText = $(
      ".jim-product-cta-box-inner h1 span[itemprop='name']"
    ).text();
    const salePriceAsText = $(".price__amount span[itemprop='price']").attr(
      "content"
    );
    const salePriceAsNumber = getPriceAsNumber(salePriceAsText)

    const priceNormal = this.getNormalPrice(priceAsText)
    const priceAsNumber = priceNormal ? getPriceAsNumber(priceNormal) : salePriceAsNumber
    const salePrice = priceNormal ? salePriceAsNumber : 0

    return { salePrice, price: priceAsNumber };
  }

  getNormalPrice(priceAsText: string): string | null {
    return priceAsText.split("Norm.")?.[1] || null;
  }
}
