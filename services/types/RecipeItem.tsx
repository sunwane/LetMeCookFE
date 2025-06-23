import { API_BASE_URL } from "@/constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { sampleSubCategories } from "./SubCategoryItem";

export interface RecipeItem {
  id: string;
  title: string;
  image: string;
  difficulty: string;
  cookingTime: string;
  totalLikes: number;
  description?: string;
  subCategoryId?: string; 
  subCategoryName?:string, 
  status?: string,
  accountId?: string,
  createAt?: string; // Thêm trường createAt
}

export interface RecipeCreationRequest {
  title: string
  description: string
  difficulty: string
  cookingTime: string
}

export interface RecipeUpdateRequest {
  title: string
  description: string
  difficulty: string
  cookingTime: string
  subCategoryId: string
}

export interface FavoritesRecipe {
  id: string;
  recipeId: string; // ID của công thức nấu ăn
  recipeName: string; // Tên công thức nấu ăn
  accountId: string; // ID của người dùng đã lưu công thức
  accountName: string; // Tên người dùng đã lưu công thức
}

export interface LikesRecipe {
  id: string;
  recipeId: string; // ID của công thức nấu ăn
  recipeName: string; // Tên công thức nấu ăn
  accountId: string; // ID của người dùng đã lưu công thức
  accountName: string; // Tên người dùng đã lưu công thức
}

export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number; // a.k.a current page index
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface ApiResponse<T> {
  code?: number
  message?: string
  result: T
}

//file riêng
export const foodData: RecipeItem[] = [
  {
    id: '1',
    title: 'Bánh Mì Ram Ram',
    image: 'https://cdn.xanhsm.com/2025/01/125f9835-banh-mi-sai-gon-thumb.jpg',
    difficulty: 'Dễ',
    cookingTime: '50m',
    totalLikes: 100,
    subCategoryId: sampleSubCategories[0].id,
    subCategoryName: sampleSubCategories[0].subCategoryName,
    createAt: '2024-12-15',
  },
  {
    id: '2',
    title: 'Phở Bò',
    image: 'https://bizweb.dktcdn.net/100/479/802/files/ham-luong-calo-trong-pho-bo-1024x712-jpeg.jpg?v=1722918596207',
    difficulty: 'Trung bình',
    cookingTime: '2h30m',
    totalLikes: 150,
    subCategoryId: sampleSubCategories[1].id,
    subCategoryName: sampleSubCategories[1].subCategoryName,
    createAt: '2024-12-10',
  },
  {
    id: '3',
    title: 'Mì Ý công thức Jollibee',
    image: 'https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/2023_10_2_638318510704271571_ca-ch-la-m-mi-y-00.jpg',
    difficulty: 'Dễ',
    cookingTime: '1h50m',
    totalLikes: 100,
    subCategoryId: sampleSubCategories[8].id,
    subCategoryName: sampleSubCategories[8].subCategoryName,
    createAt: '2024-12-08',
  },
  {
    id: '4',
    title: 'Mì xào giòn',
    image: 'https://sieuthisaigon.com.vn/upload/source/dichvu/c%C3%B4ng%20th%E1%BB%A9c%20n%E1%BA%A5u%20%C4%83n/mon%20man/mi%20xao%20gion/mi-xao-gion.jpg',
    difficulty: 'Dễ',
    cookingTime: '30m',
    totalLikes: 150,
    subCategoryId: sampleSubCategories[8].id,
    subCategoryName: sampleSubCategories[8].subCategoryName,
    createAt: '2024-12-05',
  },
  {
    id: '5',
    title: 'Bò né',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAs7Ab1hpYRXQIcjuGVnxrQZ8k8FZH4KdrfQ&s',
    difficulty: 'Dễ',
    cookingTime: '1h50m',
    totalLikes: 100,
    subCategoryId: sampleSubCategories[5].id,
    subCategoryName: sampleSubCategories[5].subCategoryName,
    createAt: '2024-12-03',
  },
  {
    id: '6',
    title: 'Mì bò Đài Loan',
    image: 'https://pos.nvncdn.com/3a420a-79556/art/artCT/20210222_bWtkmwrEt3QeViVW0JH50mgR.jpg',
    difficulty: 'Trung bình',
    cookingTime: '3h30m',
    totalLikes: 150,
    subCategoryId: sampleSubCategories[8].id,
    subCategoryName: sampleSubCategories[8].subCategoryName,
    createAt: '2024-11-28',
  },
  {
    id: '7',
    title: 'Cơm chiên hải sản',
    image: 'https://saithanhfoods.vn/wp-content/uploads/2024/10/image-13.jpeg',
    difficulty: 'Dễ',
    cookingTime: '1h50m',
    totalLikes: 100,
    subCategoryId: sampleSubCategories[3].id,
    subCategoryName: sampleSubCategories[3].subCategoryName,
    createAt: '2024-11-25',
  },
  {
    id: '8',
    title: 'Lẩu nấm chay',
    image: 'https://nhahangmocnhien.vn/wp-content/uploads/2023/10/Cach-nau-lau-chay-thap-cam.jpg',
    difficulty: 'Trung bình',
    cookingTime: '5h30m',
    totalLikes: 150,
    subCategoryId: sampleSubCategories[11].id,
    subCategoryName: sampleSubCategories[11].subCategoryName,
    createAt: '2024-11-20',
  },
  {
    id: '9',
    title: 'Cơm tấm sườn bì chả',
    image: 'https://baolamdong.vn/file/e7837c02845ffd04018473e6df282e92/052023/1.com-tam-viet-nam-hap-dan-du-khach-khi-den-da-lat-2_20230529114050.jpg',
    difficulty: 'Trung bình',
    cookingTime: '2h00m',
    totalLikes: 200,
    subCategoryId: sampleSubCategories[3].id,
    subCategoryName: sampleSubCategories[3].subCategoryName,
    createAt: '2024-11-15',
  },

];

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


export const getRecipesBySubCategory = async ( subCategoryId: string, page: number = 0, size: number = 5): Promise<ApiResponse<Page<RecipeItem>>> => {
  const token = await getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/recipe/getBySubCategory/${subCategoryId}?page=${page}&size=${size}`, {
    method: 'GET',
    headers,
  });

  const result: ApiResponse<Page<RecipeItem>> = await handleResponse(response);
  return result;
}


export const getTop5Recipes = async (): Promise<ApiResponse<RecipeItem[]>> => {
  const token = await getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/recipe/getTop5Recipes`, {
    method: 'GET',
    headers,
  });

  const result: ApiResponse<RecipeItem[]> = await handleResponse(response);
  return result;
}


export const getTrendingRecipes = async(): Promise<ApiResponse<RecipeItem[]>> => {
  const token = await getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/recipe/trendingRecipe`, {
    method: 'GET',
    headers,
  });

  const result: ApiResponse<RecipeItem[]> = await handleResponse(response);
  return result;
}

export const getNewRecipesInMonth = async(): Promise<ApiResponse<RecipeItem[]>> => {
  const token = await getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const response = await fetch(`${API_BASE_URL}/recipe/newRecipeInMonth`, {
    method: 'GET',
    headers,
  });

  const result: ApiResponse<RecipeItem[]> = await handleResponse(response);
  return result;
}

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

//Like recipe
export const getAllRecipeAccoountLike = async (recipeId: string): Promise<ApiResponse<LikesRecipe[]>> => {
  const token = await getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/like/getAllAccountLikes/${recipeId}`, {
    method: 'GET',
    headers,
  });

  const result: ApiResponse<LikesRecipe[]> = await handleResponse(response);
  return result;
}

export const createLikeRecipe = async (recipeId: string): Promise<ApiResponse<LikesRecipe>> => {
  const token = await getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/like/createLike/${recipeId}`, {
    method: 'POST',
    headers,
    body: JSON.stringify({}), // Gửi object rỗng cho LikeRecipeRequest
  });

  const result: ApiResponse<LikesRecipe> = await handleResponse(response);
  return result;
} 

export const deleteLikeRecipe = async (recipeId: string): Promise<ApiResponse<LikesRecipe>> => {
  const token = await getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/like/dislike/${recipeId}`, {
    method: 'DELETE',
    headers,
  });

  const result: ApiResponse<LikesRecipe> = await handleResponse(response);
  return result;
}