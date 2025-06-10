import { AccountItem, sampleAccounts } from "./AccountItem";
import { foodData, RecipeItem } from "./RecipeItem";

export interface CommentItem {
    id: number;
    content: string;
    like: string;
    account: AccountItem;
    recipe: RecipeItem;
  }

export const sampleComments: CommentItem[] = [
  {
    id: 1,
    content: "Mình đã thử làm món này, rất ngon và dễ làm! Các bạn nên thử nhé 😊",
    like: "15",
    account: sampleAccounts[0],
    recipe: foodData[0]
  },
  {
    id: 2,
    content: "Công thức rất chi tiết, làm theo không khó. Cảm ơn đã chia sẻ 👍",
    like: "8",
    account: sampleAccounts[1],
    recipe: foodData[1]
  },
  {
      id: 3,
      content: "Món mì tuổi thơ tuyệt vời, cảm ơn người đã chia sẻ công thức!",
      like: "15",
      account: sampleAccounts[0],
      recipe: foodData[2]
  },
];