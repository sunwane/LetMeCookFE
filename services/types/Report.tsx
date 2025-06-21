import { CommentItem } from "./CommentItem";

//trên này là các import cần thiết cho các loại dữ liệu liên quan đến report, ở đây em import sẵn comment rồi

export interface RecipeItem {
  id: string;
  comment : CommentItem;
  //sửa thuộc tính nha anh
}