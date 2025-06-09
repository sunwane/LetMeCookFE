import { Category } from "./Category";
import { SubCategoryItem } from "./SubCategoryItem";

export interface FoodItem {
  id: string;
  foodName: string;
  imageUrl: string;
  difficulty: string;
  cookingTime: string;
  likes: number;
  description?: string;
  category?: Category;
  subCategory?: SubCategoryItem; 
}
