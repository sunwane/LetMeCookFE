import { API_BASE_URL } from "@/constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Category {
    id: string;
    categoryName: string;
    categoryImg?: string;
  }

  export interface CategoryResponse {
    id: string; 
    categoryName: string;
    categoryImg?: string;
  }

  export interface ApiResponse<T> {
  code?: number
  message?: string
  result: T
}


export const sampleCategories: Category[] = [
  { id: "1geg", categoryName: 'Bún, Mì, Phở', categoryImg: 'abc'},
  { id: "hrhr", categoryName: 'Thịt', categoryImg: 'abc' },
  { id: "hrs", categoryName: 'Món chay', categoryImg: 'abc' },
  { id: "fsefsd", categoryName: 'Cơm', categoryImg: 'abc' },
  { id: "ưetwef", categoryName: 'Thức uống', categoryImg: 'abc' },
]



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

export const getAllCategories = async (): Promise<ApiResponse<Category[]>> => {
  const token = await getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/mainCategory/getAll`, {
    method: 'GET',
    headers,
  });
  console.log("Response from getAllCategories:", response);
  return handleResponse(response);
}
