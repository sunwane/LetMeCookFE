import { Ingredients, sampleIngredients } from "./Ingredients";
import { foodData, RecipeItem } from "./RecipeItem";

export interface RecipeIngredients {
    id: string;
    ingredient: Ingredients;
    recipe: RecipeItem;
    quantity: number;
}

export const sampleRecipeIngredients: RecipeIngredients[] = [
    // Bánh Mì Ram Ram (foodData[0])
    {
        id: '1',
        ingredient: sampleIngredients[0], // Ức gà
        recipe: foodData[0], // Bánh Mì Ram Ram
        quantity: 150, // 150g
    },
    {
        id: '2',
        ingredient: sampleIngredients[31], // Bơ lạt
        recipe: foodData[0], // Bánh Mì Ram Ram
        quantity: 20, // 20g
    },
    {
        id: '3',
        ingredient: sampleIngredients[14], // Cà rốt
        recipe: foodData[0], // Bánh Mì Ram Ram
        quantity: 50, // 50g
    },
    {
        id: '4',
        ingredient: sampleIngredients[18], // Dưa leo
        recipe: foodData[0], // Bánh Mì Ram Ram
        quantity: 50, // 50g
    },

    // Phở Bò (foodData[1])
    {
        id: '5',
        ingredient: sampleIngredients[1], // Thịt bò thăn
        recipe: foodData[1], // Phở Bò
        quantity: 200, // 200g
    },
    {
        id: '6',
        ingredient: sampleIngredients[10], // Bún gạo
        recipe: foodData[1], // Phở Bò
        quantity: 100, // 100g
    },
    {
        id: '7',
        ingredient: sampleIngredients[20], // Hành tây
        recipe: foodData[1], // Phở Bò
        quantity: 50, // 50g
    },
    {
        id: '8',
        ingredient: sampleIngredients[21], // Gừng
        recipe: foodData[1], // Phở Bò
        quantity: 10, // 10g
    },
    {
        id: '9',
        ingredient: sampleIngredients[46], // Hành lá
        recipe: foodData[1], // Phở Bò
        quantity: 20, // 20g
    },

    // Mì Ý công thức Jollibee (foodData[2])
    {
        id: '10',
        ingredient: sampleIngredients[9], // Mì ống
        recipe: foodData[2], // Mì Ý công thức Jollibee
        quantity: 120, // 120g
    },
    {
        id: '11',
        ingredient: sampleIngredients[17], // Cà chua
        recipe: foodData[2], // Mì Ý công thức Jollibee
        quantity: 100, // 100g
    },
    {
        id: '12',
        ingredient: sampleIngredients[30], // Phô mai cheddar
        recipe: foodData[2], // Mì Ý công thức Jollibee
        quantity: 30, // 30g
    },

    // Mì xào giòn (foodData[3])
    {
        id: '13',
        ingredient: sampleIngredients[9], // Mì ống
        recipe: foodData[3], // Mì xào giòn
        quantity: 100, // 100g
    },
    {
        id: '14',
        ingredient: sampleIngredients[5], // Tôm sú
        recipe: foodData[3], // Mì xào giòn
        quantity: 80, // 80g
    },
    {
        id: '15',
        ingredient: sampleIngredients[15], // Bắp cải
        recipe: foodData[3], // Mì xào giòn
        quantity: 60, // 60g
    },

    // Bò né (foodData[4])
    {
        id: '16',
        ingredient: sampleIngredients[1], // Thịt bò thăn
        recipe: foodData[4], // Bò né
        quantity: 150, // 150g
    },
    {
        id: '17',
        ingredient: sampleIngredients[6], // Trứng gà
        recipe: foodData[4], // Bò né
        quantity: 50, // 50g (khoảng 1 quả trứng)
    },
    {
        id: '18',
        ingredient: sampleIngredients[24], // Dầu ăn thực vật
        recipe: foodData[4], // Bò né
        quantity: 10, // 10ml
    },

    // Mì bò Đài Loan (foodData[5])
    {
        id: '19',
        ingredient: sampleIngredients[1], // Thịt bò thăn
        recipe: foodData[5], // Mì bò Đài Loan
        quantity: 180, // 180g
    },
    {
        id: '20',
        ingredient: sampleIngredients[9], // Mì ống
        recipe: foodData[5], // Mì bò Đài Loan
        quantity: 100, // 100g
    },
    {
        id: '21',
        ingredient: sampleIngredients[16], // Rau muống
        recipe: foodData[5], // Mì bò Đài Loan
        quantity: 50, // 50g
    },

    // Cơm chiên hải sản (foodData[6])
    {
        id: '22',
        ingredient: sampleIngredients[7], // Gạo trắng
        recipe: foodData[6], // Cơm chiên hải sản
        quantity: 150, // 150g
    },
    {
        id: '23',
        ingredient: sampleIngredients[5], // Tôm sú
        recipe: foodData[6], // Cơm chiên hải sản
        quantity: 80, // 80g
    },
    {
        id: '24',
        ingredient: sampleIngredients[46], // Hành lá
        recipe: foodData[6], // Cơm chiên hải sản
        quantity: 20, // 20g
    },

    // Lẩu nấm chay (foodData[7])
    {
        id: '25',
        ingredient: sampleIngredients[40], // Nấm hương
        recipe: foodData[7], // Lẩu nấm chay
        quantity: 50, // 50g
    },
    {
        id: '26',
        ingredient: sampleIngredients[41], // Nấm rơm
        recipe: foodData[7], // Lẩu nấm chay
        quantity: 50, // 50g
    },
    {
        id: '27',
        ingredient: sampleIngredients[14], // Cà rốt
        recipe: foodData[7], // Lẩu nấm chay
        quantity: 60, // 60g
    },
    {
        id: '28',
        ingredient: sampleIngredients[16], // Rau muống
        recipe: foodData[7], // Lẩu nấm chay
        quantity: 100, // 100g
    },
];