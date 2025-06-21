import { foodData, RecipeItem } from "./RecipeItem";


export interface ApiResponse<T> {
  code?: number
  message?: string
  result: T
}

export interface RecipeStep {
    id: string;
    step: number;
    description: string; // Mô tả cách làm
    recipe: RecipeItem;
    waitTime?: number; // Thời gian chờ đợi nấu (nếu có)
    stepImg?: string; // Hình ảnh mô tả bước nấu
}

export interface RecipeStepsResponse {
  id: string
  step: number
  recipeName: string
  description: string
  waitingTime?: string
  recipeStepImage?: string
}

export interface RecipeStepsCreationRequest {
  step: number
  description: string
  waitingTime?: string
}

export interface RecipeStepsUpdateRequest {
  step: number
  description: string
  waitingTime?: string
}

export const sampleRecipeSteps: RecipeStep[] = [
    // Bánh Mì Ram Ram (foodData[0])
    {
        id: '1',
        step: 1,
        description: 'Sơ chế nguyên liệu: Thái lát mỏng ức gà, ướp với muối, tiêu và tỏi băm nhuyễn trong 15 phút.',
        recipe: foodData[0],
        waitTime: 15,
        stepImg: 'https://example.com/step1-prep-chicken.jpg'
    },
    {
        id: '2',
        step: 2,
        description: 'Thái sợi cà rốt và dưa leo, ngâm trong nước muối loãng để giòn.',
        recipe: foodData[0],
        waitTime: 10,
    },
    {
        id: '3',
        step: 3,
        description: 'Chiên ức gà đã ướp trong chảo với một ít dầu ăn cho đến khi vàng đều hai mặt.',
        recipe: foodData[0],
        waitTime: 8,
    },
    {
        id: '4',
        step: 4,
        description: 'Nướng bánh mì cho giòn, phết bơ lạt đều bên trong.',
        recipe: foodData[0],
        waitTime: 3,
    },
    {
        id: '5',
        step: 5,
        description: 'Kẹp thịt gà, rau sống vào bánh mì và thưởng thức.',
        recipe: foodData[0],
    },

    // Phở Bò (foodData[1])
    {
        id: '6',
        step: 1,
        description: 'Nướng xương bò và hành tây trên lửa để tạo hương thơm đậm đà.',
        recipe: foodData[1],
        waitTime: 30,
        stepImg: 'https://example.com/step1-roast-bones.jpg'
    },
    {
        id: '7',
        step: 2,
        description: 'Cho xương, thịt bò vào nồi lớn, đổ nước ngập. Nấu sôi và vớt bọt.',
        recipe: foodData[1],
        waitTime: 20,
    },
    {
        id: '8',
        step: 3,
        description: 'Thêm gừng, hành tây nướng, gia vị. Niêu nhỏ lửa và niêu 2-3 tiếng.',
        recipe: foodData[1],
        waitTime: 180,
    },
    {
        id: '9',
        step: 4,
        description: 'Luộc bánh phở trong nước sôi 1-2 phút, vớt ra tô.',
        recipe: foodData[1],
        waitTime: 2,
    },
    {
        id: '10',
        step: 5,
        description: 'Thái thịt bò mỏng, xếp lên bánh phở, chan nước dùng nóng.',
        recipe: foodData[1],
    },
    {
        id: '11',
        step: 6,
        description: 'Rắc hành lá băm nhỏ lên trên và thưởng thức kèm rau sống.',
        recipe: foodData[1],
    },

    // Mì Ý công thức Jollibee (foodData[2])
    {
        id: '12',
        step: 1,
        description: 'Luộc mì ống trong nước sôi có muối cho đến khi mềm vừa.',
        recipe: foodData[2],
        waitTime: 10,
    },
    {
        id: '13',
        step: 2,
        description: 'Làm sốt cà chua: Xào tỏi thơm, cho cà chua nghiền vào.',
        recipe: foodData[2],
        waitTime: 5,
    },
    {
        id: '14',
        step: 3,
        description: 'Nêm nếm gia vị, cho mì vào trộn đều với sốt.',
        recipe: foodData[2],
        waitTime: 3,
    },
    {
        id: '15',
        step: 4,
        description: 'Rắc phô mai cheddar bào nhỏ lên trên và thưởng thức.',
        recipe: foodData[2],
    },

    // Mì xào giòn (foodData[3])
    {
        id: '16',
        step: 1,
        description: 'Chiên mì trong dầu nóng cho đến khi vàng giòn, vớt ra để ráo.',
        recipe: foodData[3],
        waitTime: 5,
    },
    {
        id: '17',
        step: 2,
        description: 'Sơ chế tôm sú: Bóc vỏ, khử mùi tanh với rượu và muối.',
        recipe: foodData[3],
        waitTime: 10,
    },
    {
        id: '18',
        step: 3,
        description: 'Xào tôm cho chín, thêm bắp cải thái sợi vào xào cùng.',
        recipe: foodData[3],
        waitTime: 7,
    },
    {
        id: '19',
        step: 4,
        description: 'Pha nước sốt với nước tương, đường, nước mắm. Đổ lên mì và rau.',
        recipe: foodData[3],
        waitTime: 2,
    },

    // Bò né (foodData[4])
    {
        id: '20',
        step: 1,
        description: 'Thái thịt bò thăn thành từng miếng vừa ăn, ướp với gia vị.',
        recipe: foodData[4],
        waitTime: 20,
    },
    {
        id: '21',
        step: 2,
        description: 'Làm nóng chảo gang, cho dầu ăn vào.',
        recipe: foodData[4],
        waitTime: 3,
    },
    {
        id: '22',
        step: 3,
        description: 'Áp chảo thịt bò cho đến khi chín tái, vẫn mềm bên trong.',
        recipe: foodData[4],
        waitTime: 4,
    },
    {
        id: '23',
        step: 4,
        description: 'Đẩy thịt sang một bên, đập trứng gà vào chảo để ăn kèm.',
        recipe: foodData[4],
        waitTime: 3,
    },
    {
        id: '24',
        step: 5,
        description: 'Thưởng thức nóng cùng bánh mì và rau sống.',
        recipe: foodData[4],
    },

    // Mì bò Đài Loan (foodData[5])
    {
        id: '25',
        step: 1,
        description: 'Cắt thịt bò thành từng miếng to, ướp với gia vị Đài Loan.',
        recipe: foodData[5],
        waitTime: 30,
    },
    {
        id: '26',
        step: 2,
        description: 'Niêu thịt bò với nước dùng, hành khô, cà chua trong 2 tiếng.',
        recipe: foodData[5],
        waitTime: 120,
    },
    {
        id: '27',
        step: 3,
        description: 'Luộc mì tươi và rau muống trong nước dùng.',
        recipe: foodData[5],
        waitTime: 5,
    },
    {
        id: '28',
        step: 4,
        description: 'Cho mì, thịt bò, rau vào tô, chan nước dùng và thưởng thức.',
        recipe: foodData[5],
    },

    // Cơm chiên hải sản (foodData[6])
    {
        id: '29',
        step: 1,
        description: 'Nấu cơm trước một ngày để cơm khô, hạt rời.',
        recipe: foodData[6],
        waitTime: 1440, // 1 ngày
    },
    {
        id: '30',
        step: 2,
        description: 'Sơ chế hải sản: Rửa sạch tôm, bóc vỏ để nguyên đuôi.',
        recipe: foodData[6],
        waitTime: 10,
    },
    {
        id: '31',
        step: 3,
        description: 'Đập trứng, tráng thành tấm mỏng rồi thái sợi.',
        recipe: foodData[6],
        waitTime: 5,
    },
    {
        id: '32',
        step: 4,
        description: 'Xào tôm cho chín, cho cơm vào xào đều trên lửa lớn.',
        recipe: foodData[6],
        waitTime: 8,
    },
    {
        id: '33',
        step: 5,
        description: 'Thêm trứng, hành lá, nêm nếm và xào đều.',
        recipe: foodData[6],
        waitTime: 3,
    },

    // Lẩu nấm chay (foodData[7])
    {
        id: '34',
        step: 1,
        description: 'Ngâm nấm hương trong nước ấm 30 phút cho nở mềm.',
        recipe: foodData[7],
        waitTime: 30,
    },
    {
        id: '35',
        step: 2,
        description: 'Thái múi cà rốt, rửa sạch rau muống và nấm rơm.',
        recipe: foodData[7],
        waitTime: 10,
    },
    {
        id: '36',
        step: 3,
        description: 'Nấu nước dùng chay từ rau củ, nấm hương và kelp.',
        recipe: foodData[7],
        waitTime: 45,
    },
    {
        id: '37',
        step: 4,
        description: 'Cho tất cả nấm và rau củ vào nồi lẩu.',
        recipe: foodData[7],
        waitTime: 10,
    },
    {
        id: '38',
        step: 5,
        description: 'Đun sôi và thưởng thức cùng mì tôm hoặc bún tươi.',
        recipe: foodData[7],
    },

    // Cơm tấm sườn bì chả (foodData[8])
    {
        id: '39',
        step: 1,
        description: 'Ướp sườn nướng với đường, mắm nêm, tỏi, sả trong 2 tiếng.',
        recipe: foodData[8],
        waitTime: 120,
    },
    {
        id: '40',
        step: 2,
        description: 'Nướng sườn trên than hoa cho đến khi chín đều, thơm phức.',
        recipe: foodData[8],
        waitTime: 20,
    },
    {
        id: '41',
        step: 3,
        description: 'Hấp chả trứng và bì (da heo) cho mềm.',
        recipe: foodData[8],
        waitTime: 15,
    },
    {
        id: '42',
        step: 4,
        description: 'Nấu cơm tấm (gạo tấm) trong nồi cơm điện.',
        recipe: foodData[8],
        waitTime: 25,
    },
    {
        id: '43',
        step: 5,
        description: 'Bày cơm ra đĩa, xếp sườn, bì, chả lên trên.',
        recipe: foodData[8],
    },
    {
        id: '44',
        step: 6,
        description: 'Thưởng thức kèm với nước mắm pha và dưa góp.',
        recipe: foodData[8],
    },
];