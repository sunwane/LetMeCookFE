import { AccountItem } from "./AccountItem";
import { FoodItem } from "./FoodItem";

export interface CommentItem {
    id: number;
    content: string;
    like: string;
    account: AccountItem;
    food: FoodItem;
  }