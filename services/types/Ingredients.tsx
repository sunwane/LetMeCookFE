import { API_BASE_URL } from "@/constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Ingredients {
  id: string;
  ingredientName: string;
  caloriesPerUnit: number;
  measurementUnit: string; 
}

export interface ApiResponse<T> {
  code?: number
  message?: string
  result: T
}

export const sampleIngredients: Ingredients[] = [
  { id: '1', ingredientName: 'Ức gà', caloriesPerUnit: 1.65, measurementUnit: 'g' },
  { id: '2', ingredientName: 'Thịt bò thăn', caloriesPerUnit: 2.50, measurementUnit: 'g' },
  { id: '3', ingredientName: 'Thịt lợn nạc', caloriesPerUnit: 1.43, measurementUnit: 'g' },
  { id: '4', ingredientName: 'Cá hồi', caloriesPerUnit: 2.08, measurementUnit: 'g' },
  { id: '5', ingredientName: 'Cá thu', caloriesPerUnit: 2.05, measurementUnit: 'g' },
  { id: '6', ingredientName: 'Tôm sú', caloriesPerUnit: 0.99, measurementUnit: 'g' },
  { id: '7', ingredientName: 'Trứng gà', caloriesPerUnit: 1.55, measurementUnit: 'g' },
  { id: '8', ingredientName: 'Gạo trắng', caloriesPerUnit: 1.30, measurementUnit: 'g' },
  { id: '9', ingredientName: 'Gạo lứt', caloriesPerUnit: 1.23, measurementUnit: 'g' },
  { id: '10', ingredientName: 'Mì ống', caloriesPerUnit: 1.31, measurementUnit: 'g' },
  { id: '11', ingredientName: 'Bún gạo', caloriesPerUnit: 1.10, measurementUnit: 'g' },
  { id: '12', ingredientName: 'Khoai tây', caloriesPerUnit: 0.77, measurementUnit: 'g' },
  { id: '13', ingredientName: 'Khoai lang', caloriesPerUnit: 0.86, measurementUnit: 'g' },
  { id: '14', ingredientName: 'Cà rốt', caloriesPerUnit: 0.41, measurementUnit: 'g' },
  { id: '15', ingredientName: 'Bắp cải', caloriesPerUnit: 0.25, measurementUnit: 'g' },
  { id: '16', ingredientName: 'Cải bó xôi', caloriesPerUnit: 0.23, measurementUnit: 'g' },
  { id: '17', ingredientName: 'Rau muống', caloriesPerUnit: 0.20, measurementUnit: 'g' },
  { id: '18', ingredientName: 'Cà chua', caloriesPerUnit: 0.18, measurementUnit: 'g' },
  { id: '19', ingredientName: 'Dưa leo', caloriesPerUnit: 0.16, measurementUnit: 'g' },
  { id: '20', ingredientName: 'Hành tây', caloriesPerUnit: 0.40, measurementUnit: 'g' },
  { id: '21', ingredientName: 'Tỏi', caloriesPerUnit: 1.49, measurementUnit: 'g' },
  { id: '22', ingredientName: 'Gừng', caloriesPerUnit: 0.80, measurementUnit: 'g' },
  { id: '23', ingredientName: 'Nước mắm', caloriesPerUnit: 0.35, measurementUnit: 'ml' },
  { id: '24', ingredientName: 'Dầu ô liu', caloriesPerUnit: 8.84, measurementUnit: 'ml' },
  { id: '25', ingredientName: 'Dầu ăn thực vật', caloriesPerUnit: 8.84, measurementUnit: 'ml' },
  { id: '26', ingredientName: 'Đường trắng', caloriesPerUnit: 3.87, measurementUnit: 'g' },
  { id: '27', ingredientName: 'Muối', caloriesPerUnit: 0, measurementUnit: 'g' },
  { id: '28', ingredientName: 'Tiêu đen', caloriesPerUnit: 2.51, measurementUnit: 'g' },
  { id: '29', ingredientName: 'Sữa tươi không đường', caloriesPerUnit: 0.42, measurementUnit: 'ml' },
  { id: '30', ingredientName: 'Sữa đặc', caloriesPerUnit: 3.21, measurementUnit: 'g' },
  { id: '31', ingredientName: 'Phô mai cheddar', caloriesPerUnit: 4.03, measurementUnit: 'g' },
  { id: '32', ingredientName: 'Bơ lạt', caloriesPerUnit: 7.17, measurementUnit: 'g' },
  { id: '33', ingredientName: 'Chuối', caloriesPerUnit: 0.89, measurementUnit: 'g' },
  { id: '34', ingredientName: 'Táo', caloriesPerUnit: 0.52, measurementUnit: 'g' },
  { id: '35', ingredientName: 'Xoài', caloriesPerUnit: 0.60, measurementUnit: 'g' },
  { id: '36', ingredientName: 'Dứa', caloriesPerUnit: 0.50, measurementUnit: 'g' },
  { id: '37', ingredientName: 'Đậu phộng', caloriesPerUnit: 5.67, measurementUnit: 'g' },
  { id: '38', ingredientName: 'Hạt điều', caloriesPerUnit: 5.53, measurementUnit: 'g' },
  { id: '39', ingredientName: 'Đậu đỏ', caloriesPerUnit: 3.37, measurementUnit: 'g' },
  { id: '40', ingredientName: 'Đậu xanh', caloriesPerUnit: 3.47, measurementUnit: 'g' },
  { id: '41', ingredientName: 'Nấm hương', caloriesPerUnit: 0.34, measurementUnit: 'g' },
  { id: '42', ingredientName: 'Nấm rơm', caloriesPerUnit: 0.22, measurementUnit: 'g' },
  { id: '43', ingredientName: 'Măng tây', caloriesPerUnit: 0.20, measurementUnit: 'g' },
  { id: '44', ingredientName: 'Bí đỏ', caloriesPerUnit: 0.26, measurementUnit: 'g' },
  { id: '45', ingredientName: 'Bí xanh', caloriesPerUnit: 0.17, measurementUnit: 'g' },
  { id: '46', ingredientName: 'Ớt chuông', caloriesPerUnit: 0.27, measurementUnit: 'g' },
  { id: '47', ingredientName: 'Hành lá', caloriesPerUnit: 0.32, measurementUnit: 'g' },
  { id: '48', ingredientName: 'Rau mùi', caloriesPerUnit: 0.23, measurementUnit: 'g' },
  { id: '49', ingredientName: 'Thì là', caloriesPerUnit: 0.30, measurementUnit: 'g' },
  { id: '50', ingredientName: 'Mật ong', caloriesPerUnit: 3.04, measurementUnit: 'g' },
  { id: '51', ingredientName: 'Nước cốt dừa', caloriesPerUnit: 2.30, measurementUnit: 'ml' },
  { id: '52', ingredientName: 'Bột mì', caloriesPerUnit: 3.64, measurementUnit: 'g' },
  { id: '53', ingredientName: 'Bột năng', caloriesPerUnit: 3.59, measurementUnit: 'g' },
  { id: '54', ingredientName: 'Thịt ba chỉ', caloriesPerUnit: 5.41, measurementUnit: 'g' },
  { id: '55', ingredientName: 'Cá basa', caloriesPerUnit: 1.18, measurementUnit: 'g' },
];


const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || `API Error: ${response.status}`)
  }
  return response.json()
}


const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('authToken');
  } catch (error) {
    console.error('Failed to get auth token:', error);
    return null;
  }
};

export const getAllIngredients = async (): Promise<ApiResponse<Ingredients[]>> => {
  const token = await getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/ingredients/getAll`, {
    method: 'GET',
    headers,
  });

  return handleResponse(response);
};

