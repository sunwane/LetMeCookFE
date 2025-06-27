import { create } from "zustand";
import { RecipeItem } from "../types/RecipeItem";

interface RecipeStoreState {
  recipes: RecipeItem[];
  setRecipes: (recipes: RecipeItem[]) => void;
  updateRecipeLikes: (recipeId: string, totalLikes: number) => void;
}

export const useRecipeStore = create<RecipeStoreState>((set) => ({
  recipes: [],
  setRecipes: (recipes) => set({ recipes }),
  updateRecipeLikes: (recipeId, totalLikes) =>
    set((state) => ({
      recipes: state.recipes.map((recipe) =>
        recipe.id === recipeId ? { ...recipe, totalLikes } : recipe
      ),
    })),
}));
