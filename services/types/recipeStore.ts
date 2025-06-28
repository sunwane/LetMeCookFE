import { create } from "zustand";
import { RecipeItem } from "../types/RecipeItem";

interface RecipeStoreState {
  recipes: RecipeItem[];
  setRecipes: (recipes: RecipeItem[]) => void;
  addOrUpdateRecipes: (recipes: RecipeItem[]) => void;
  updateRecipeLikes: (recipeId: string, totalLikes: number) => void;
}

export const useRecipeStore = create<RecipeStoreState>((set) => ({
  recipes: [],
  setRecipes: (recipes) => set({ recipes }),

  addOrUpdateRecipes: (recipes) =>
    set((state) => {
      const updatedMap = new Map(state.recipes.map((r) => [r.id, r]));
      recipes.forEach((r) => updatedMap.set(r.id, r));
      return { recipes: Array.from(updatedMap.values()) };
    }),

    updateRecipeLikes: (recipeId, totalLikes) =>
      set((state) => {
        console.log(`🛠️ Updating likes for recipeId: ${recipeId} to ${totalLikes}`);
        return {
          recipes: state.recipes.map((recipe) =>
            recipe.id === recipeId ? { ...recipe, totalLikes } : recipe
          ),
        };
      }),
    
}));
