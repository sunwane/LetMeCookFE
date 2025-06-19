import { API_BASE_URL } from '../../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ===== USERINFO API INTERFACES =====
export interface UserInfoCreationRequest {
  sex: string;
  height: number;
  weight: number;
  age: number;
  dob: string; // Format: "YYYY-MM-DD"
  dietTypes: string[]; // ["VEGETARIAN", "KETO", etc.]
}

export interface UserInfoUpdateRequest {
  sex?: string;
  height?: number;
  weight?: number;
  age?: number;
  dob?: string;
  dietTypes?: string[];
}

export interface UserInfoResponse {
  id: string;
  sex: string;
  height: number;
  weight: number;
  age: number;
  dob: string;
  dietTypes: string[];
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UsernameResponse {
  id: string;
  username: string;
  avatar?: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface ApiResponse<T> {
  result: T;
  code?: number;
  message?: string;
}

// UserInfo.ts - Add at the top if not exists
export interface RecipeResponse {
  id: string;
  name: string;
  description?: string;
  accountId: string;
  // ... other recipe fields
}

// Helper function to get auth token
const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('authToken');
  } catch (error) {
    console.error('Failed to get auth token:', error);
    return null;
  }
};

// Helper function to get account ID
const getAccountId = async (): Promise<string> => {
  try {
    // Try to get from AsyncStorage first
    const storedAccountId = await AsyncStorage.getItem('accountId');
    if (storedAccountId) {
      console.log("📱 Found accountId in storage:", storedAccountId);
      return storedAccountId;
    }
    
    // Try to get from email as fallback
    const storedEmail = await AsyncStorage.getItem('userEmail');
    if (storedEmail) {
      console.log("📧 Using email as accountId:", storedEmail);
      return storedEmail;
    }
    
    throw new Error('No account identifier found');
  } catch (error) {
    console.error('Failed to get account ID:', error);
    throw error;
  }
};

// POST /user-info?accountId={accountId}
export const createUserInfoAPI = async (
  data: UserInfoCreationRequest
): Promise<UserInfoResponse> => {
  try {
    const token = await getAuthToken();
    const accountId = await getAccountId();
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    console.log(`🌐 API URL: ${API_BASE_URL}/user-info?accountId=${accountId}`);
    console.log("📤 Request data:", data);
    console.log("🔑 Using token:", token.substring(0, 20) + "...");

    const response = await fetch(`${API_BASE_URL}/user-info?accountId=${accountId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    console.log("📥 Response status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Response error:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const apiResponse: ApiResponse<UserInfoResponse> = await response.json();
    console.log("✅ API Response:", apiResponse);
    
    return apiResponse.result;
  } catch (error) {
    console.error('❌ Failed to create user info:', error);
    throw error;
  }
};

// PUT /user-info/{id}
export const updateUserInfoAPI = async (
  id: string, 
  data: UserInfoUpdateRequest
): Promise<UserInfoResponse> => {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/user-info/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const apiResponse: ApiResponse<UserInfoResponse> = await response.json();
    return apiResponse.result;
  } catch (error) {
    console.error('❌ Failed to update user info:', error);
    throw error;
  }
};

// GET /user-info
export const getUserInfoAPI = async (): Promise<UserInfoResponse> => {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/user-info`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const apiResponse: ApiResponse<UserInfoResponse> = await response.json();
    return apiResponse.result;
  } catch (error) {
    console.error('❌ Failed to get user info:', error);
    throw error;
  }
};

// GET /user-info/getAll
export const getAllUserInfoAPI = async (page = 0, size = 3): Promise<Page<UserInfoResponse>> => {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/user-info/getAll?page=${page}&size=${size}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const apiResponse: ApiResponse<Page<UserInfoResponse>> = await response.json();
    return apiResponse.result;
  } catch (error) {
    console.error('❌ Failed to get all user info:', error);
    throw error;
  }
};

// POST /user-info/avatar
export const uploadAvatarAPI = async (avatar: File): Promise<UserInfoResponse> => {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const formData = new FormData();
    formData.append('avatar', avatar);

    const response = await fetch(`${API_BASE_URL}/user-info/avatar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const apiResponse: ApiResponse<UserInfoResponse> = await response.json();
    return apiResponse.result;
  } catch (error) {
    console.error('❌ Failed to upload avatar:', error);
    throw error;
  }
};

// DELETE /user-info/avatar
export const deleteAvatarAPI = async (): Promise<UserInfoResponse> => {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/user-info/avatar`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const apiResponse: ApiResponse<UserInfoResponse> = await response.json();
    return apiResponse.result;
  } catch (error) {
    console.error('❌ Failed to delete avatar:', error);
    throw error;
  }
};

// GET /user-info/search
export const searchByUsernameAPI = async (keyword: string): Promise<UsernameResponse[]> => {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/user-info/search?keyword=${keyword}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const apiResponse: ApiResponse<UsernameResponse[]> = await response.json();
    return apiResponse.result;
  } catch (error) {
    console.error('❌ Failed to search by username:', error);
    throw error;
  }
};

// GET /recipe/getRecipeByAccount - count recipes from response
export const getRecipeCountByUserAPI = async (): Promise<number> => {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    console.log(`🌐 API URL: ${API_BASE_URL}/recipe/getRecipeByAccount`);
    console.log("🔑 Using token:", token.substring(0, 20) + "...");

    // ✅ Get all recipes by current user
    const response = await fetch(`${API_BASE_URL}/recipe/getRecipeByAccount`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log("📥 Response status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Response error:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const apiResponse: ApiResponse<RecipeResponse[]> = await response.json();
    console.log("✅ Recipes API response:", apiResponse);
    
    // ✅ Count the number of recipes
    const recipeCount = apiResponse.result?.length || 0;
    console.log("🔢 Recipe count:", recipeCount);
    
    return recipeCount;
  } catch (error) {
    console.error('❌ Failed to get recipe count:', error);
    return 0;
  }
};