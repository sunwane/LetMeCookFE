import { Category } from "./Category";

export interface SubCategoryItem {
    id: string;
    name: string;
    imageUrl: string;
    description: string;
    category?: Category;
}