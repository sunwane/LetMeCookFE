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
  {
    id: 4,
    content: "Bánh mì ram ram này nhìn hấp dẫn quá! Mình sẽ thử làm cuối tuần này 🤤",
    like: "23",
    account: sampleAccounts[2],
    recipe: foodData[0]
  },
  {
    id: 5,
    content: "Phở bò là món ăn yêu thích của gia đình mình. Công thức này hay lắm!",
    like: "12",
    account: sampleAccounts[1],
    recipe: foodData[1]
  },
  {
    id: 6,
    content: "Làm theo công thức này mà vị như ngoài hàng luôn. Tuyệt vời! 👏",
    like: "31",
    account: sampleAccounts[0],
    recipe: foodData[2]
  },
  {
    id: 7,
    content: "Mì xào giòn trông ngon ghê, cho mình hỏi có thể thay thế rau gì không ạ?",
    like: "7",
    account: sampleAccounts[2],
    recipe: foodData[3]
  },
  {
    id: 8,
    content: "Bò né đúng gu mình rồi! Cảm ơn bạn đã chia sẻ công thức này 🥩",
    like: "18",
    account: sampleAccounts[1],
    recipe: foodData[4]
  },
  {
    id: 9,
    content: "Lần đầu làm mì bò Đài Loan mà thành công luôn. Recipe này 10 điểm!",
    like: "25",
    account: sampleAccounts[0],
    recipe: foodData[5]
  },
  {
    id: 10,
    content: "Cơm chiên hải sản nhìn tươi ngon quá. Mình sẽ thử làm cho gia đình",
    like: "14",
    account: sampleAccounts[2],
    recipe: foodData[6]
  },
  {
    id: 11,
    content: "Lẩu chay này perfect cho những ngày ăn chay. Thanks bạn! 🌱",
    like: "20",
    account: sampleAccounts[1],
    recipe: foodData[7]
  },
  {
    id: 12,
    content: "Cơm tấm sườn bì chả đúng vị miền Nam luôn. Nhớ quê hương ghê!",
    like: "33",
    account: sampleAccounts[0],
    recipe: foodData[8]
  },
  {
    id: 13,
    content: "Làm bánh mì này mà con nhỏ nhà mình khen ngon hơn ngoài hàng nữa 😄",
    like: "28",
    account: sampleAccounts[2],
    recipe: foodData[0]
  },
  {
    id: 14,
    content: "Nước dùng phở có vị đậm đà, bí quyết ở chỗ nào vậy bạn?",
    like: "9",
    account: sampleAccounts[1],
    recipe: foodData[1]
  },
  {
    id: 15,
    content: "Mì Ý Jollibee này ngon không thua gì hàng thật. Siêu đỉnh! 🍝",
    like: "42",
    account: sampleAccounts[0],
    recipe: foodData[2]
  }
];