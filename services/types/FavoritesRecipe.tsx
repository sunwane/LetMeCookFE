import { AccountItem, sampleAccounts } from "./AccountItem";
import { foodData, RecipeItem } from "./RecipeItem";

export interface FavoritesRecipe {
    account: AccountItem;
    food: RecipeItem;
  }

  export const sampleFavorites: FavoritesRecipe[] = [
    {
      account: sampleAccounts[0],
      food: foodData[0]
    },
    {
      account: sampleAccounts[1],
      food: foodData[3]
    },
    {
      account: sampleAccounts[1],
      food: foodData[4]
    },
    {
      account: sampleAccounts[1],
      food: foodData[5]
    },
    {
      account: sampleAccounts[0],
      food: foodData[1]
    },
    {
      account: sampleAccounts[0],
      food: foodData[2]
    }
  ];