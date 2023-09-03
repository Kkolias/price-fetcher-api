import ShopItem from "../Schema/ShopItem";
import util from "./getPrices";

export class CronJobUtil {
  async updateAllPriceLists(): Promise<any> {
    try {
      // Fetch all shop items from the database
      const shopItems = await ShopItem.find();
      if(!shopItems?.length) {
        console.log("No shopItems yet")
        return
      }

      // Iterate over each shop item
      for (const shopItem of shopItems) {
        try {
          // Call your getPrice function using the web scraper
          await util.updateShopItemPrice(shopItem);
        } catch (error) {
          console.error(`Error updating shop item ${shopItem.name}:`, error);
        }
      }
    } catch (error) {
      console.error("Error fetching shop items:", error);
    }
  }
}

export default new CronJobUtil();
