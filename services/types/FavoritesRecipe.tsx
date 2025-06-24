import { API_BASE_URL } from "@/constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RecipeItem } from "./RecipeItem";

export interface FavoritesRecipe {
  food: RecipeItem;
  id: string;
  recipeId: string; // ID của công thức nấu ăn
  recipeName: string; // Tên công thức nấu ăn
  accountId: string; // ID của người dùng đã lưu công thức
  accountName: string; // Tên người dùng đã lưu công thức
}


  export interface ApiResponse<T> {
  code?: number
  message?: string
  result: T
}


  // export const sampleFavorites: FavoritesRecipe[] = [
  //   {
  //     accountId: sampleAccounts[0].id,
  //     food: foodData[0]
  //   },
  //   {
  //     account: sampleAccounts[1],
  //     food: foodData[3]
  //   },
  //   {
  //     account: sampleAccounts[1],
  //     food: foodData[4]
  //   },
  //   {
  //     account: sampleAccounts[1],
  //     food: foodData[5]
  //   },
  //   {
  //     account: sampleAccounts[0],
  //     food: foodData[1]
  //   },
  //   {
  //     account: sampleAccounts[0],
  //     food: foodData[2]
  //   }
  // ];

  const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('authToken');
  } catch (error) {
    console.error('Failed to get auth token:', error);
    return null;
  }
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `API Error: ${response.status}`);
  }
  return response.json();
};

  //favorite recipe
  export const createFavoriteRecipe = async (recipeId: string): Promise<ApiResponse<FavoritesRecipe>> => {
   
    const token = await getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  
    const response = await fetch(`${API_BASE_URL}/favourite/create/${recipeId}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({}), // Gửi object rỗng cho FavouriteRecipeRequest
    });
  
    const result: ApiResponse<FavoritesRecipe> = await handleResponse(response);
    return result;
  }
  
  
  export const getAllFavouriteRecipe =async(): Promise<ApiResponse<FavoritesRecipe[]>> => {
    const token = await getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  
    const response = await fetch(`${API_BASE_URL}/favourite/getAllFavourite`, {
      method: 'GET',
      headers,
    });
  
    const result: ApiResponse<FavoritesRecipe[]> = await handleResponse(response);
    return result;
  }
  
  export const deleteFavoriteRecipe = async (recipeId: string): Promise<ApiResponse<FavoritesRecipe>> => {
    const token = await getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  
    const response = await fetch(`${API_BASE_URL}/favourite/deleteFavourite/${recipeId}`, {
      method: 'DELETE',
      headers,
    });
  
    const result: ApiResponse<FavoritesRecipe> = await handleResponse(response);
    return result;
  }