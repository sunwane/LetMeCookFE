import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../constants/api';

// ===== USERINFO API INTERFACES =====
export interface UserInfoCreationRequest {
  sex: string;
  height: number;
  weight: number;
  age: number;
  dietTypes: string[]; 
}

export interface UserInfoUpdateRequest {
  sex?: string;
  height?: number;
  weight?: number;
  age?: number;
  dietTypes?: string[];
}

export interface UserInfoResponse {
  id: string;
  sex: string;
  height: number;
  weight: number;
  age: number;
  dietTypes: string[];
  avatar?: string;
  accountId: string; // ✅ ADD: missing field
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
    const token = await getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    // Decode account ID from JWT token
    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    return tokenPayload.id || tokenPayload.accountId || tokenPayload.sub;
    
  } catch (error) {
    console.error('Failed to get account ID:', error);
    throw error;
  }
};

// Thêm helper function để xử lý avatar
export const getAvatarSource = (avatar?: string) => {
  
  if (avatar && avatar.trim() !== '' && avatar !== 'null' && avatar !== 'undefined') {
    return { uri: avatar };
  }
  
  console.log('Using default avatar');
  return { uri: 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg' };
};

// POST /user-info?accountId={accountId}
export const createUserInfoAPI = async (
  data: UserInfoCreationRequest,
  accountId?: string // ✅ Optional accountId parameter
): Promise<UserInfoResponse> => {
  try {
    let targetAccountId = accountId;
    
    // ✅ Nếu không có accountId, lấy từ AsyncStorage
    if (!targetAccountId) {
      targetAccountId = await getAccountId();
    }
    
    console.log(`🌐 API URL: ${API_BASE_URL}/user-info?accountId=${targetAccountId}`);
    console.log("📤 Request data:", data);
    console.log("🔓 Public API - No token required");

    // ✅ Không cần token và Authorization header
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds

    const response = await fetch(`${API_BASE_URL}/user-info?accountId=${targetAccountId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      signal: controller.signal, // ✅ Add abort signal
    });

    clearTimeout(timeoutId);
    
    console.log("📥 Response status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Response error:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const apiResponse: ApiResponse<UserInfoResponse> = await response.json();
    console.log("✅ API Response:", apiResponse);
    
    return apiResponse.result;
  } catch (error: unknown) { // ✅ Explicit unknown type
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - please try again');
      }
      console.error('❌ Failed to create user info:', error.message);
      throw error;
    }
    
    // ✅ Handle non-Error types
    console.error('❌ Failed to create user info:', String(error));
    throw new Error('An unknown error occurred while creating user info');
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
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('❌ Failed to update user info:', error.message);
      throw error;
    }
    
    console.error('❌ Failed to update user info:', String(error));
    throw new Error('An unknown error occurred while updating user info');
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
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('❌ Failed to get user info:', error.message);
      throw error;
    }
    
    console.error('❌ Failed to get user info:', String(error));
    throw new Error('An unknown error occurred while fetching user info');
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

// POST /user-info/avatar - React Native version
export const uploadAvatarAPI = async (imageUri: string): Promise<UserInfoResponse> => {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const formData = new FormData();
    formData.append('avatar', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'avatar.jpg',
    } as any);

    const response = await fetch(`${API_BASE_URL}/user-info/avatar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
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
    const token = await AsyncStorage.getItem('authToken');
    
    if (!token) {
      console.log(" No auth token found");
      return 0; 
    }

    const response = await fetch(`${API_BASE_URL}/recipe/getRecipeByAccount`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // ✅ If 401, token expired - just return 0
      if (response.status === 401) {
        console.log("⚠️ Token expired");
        await AsyncStorage.removeItem('authToken');
        return 0;
      }
      
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.result?.length || 0;
  } catch (error: unknown) {
    // if (error instanceof Error) {
    //   console.error('❌ Failed to get recipe count:', error.message);
    // } else {
    //   console.error('❌ Failed to get recipe count:', String(error));
    // }
    return 0;
  }
};


