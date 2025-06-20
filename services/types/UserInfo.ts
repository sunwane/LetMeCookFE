import { API_BASE_URL } from '../../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
// UserInfo.ts - sửa getAccountId function
const getAccountId = async (): Promise<string> => {
  try {
    // ✅ Priority 1: Real accountId from register
    const storedAccountId = await AsyncStorage.getItem('accountId');
    if (storedAccountId) {
      console.log("📱 Found real accountId in storage:", storedAccountId);
      return storedAccountId;
    }
    
    // ✅ Priority 2: Decode from token (for authenticated users)
    const token = await getAuthToken();
    if (token) {
      try {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        if (tokenPayload.sub && tokenPayload.sub !== tokenPayload.email) {
          console.log("🔑 Found accountId in token:", tokenPayload.sub);
          return tokenPayload.sub;
        }
      } catch (tokenError) {
        console.log("⚠️ Failed to decode token");
      }
    }
    
    throw new Error('No account identifier found');
  } catch (error) {
    console.error('Failed to get account ID:', error);
    throw error;
  }
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
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - please try again');
    }
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
// UserInfo.ts - sửa getRecipeCountByUserAPI
export const getRecipeCountByUserAPI = async (): Promise<number> => {
  try {
    // ✅ Get normal token first, if 401 -> use setup-token flow
    let token = await AsyncStorage.getItem('authToken');
    
    if (!token) {
      console.log("🔄 No auth token, getting setup token...");
      const userEmail = await AsyncStorage.getItem('userEmail');
      const userPassword = await AsyncStorage.getItem('userPassword');
      
      if (userEmail && userPassword) {
        const authResponse = await fetch(`${API_BASE_URL}/auth/setup-token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: userEmail, password: userPassword }),
        });
        
        if (authResponse.ok) {
          const authData = await authResponse.json();
          token = authData.result.token;
          await AsyncStorage.setItem('authToken', token);
        }
      }
    }

    const response = await fetch(`${API_BASE_URL}/recipe/getRecipeByAccount`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Response error: ${errorText}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.result?.length || 0;
  } catch (error) {
    console.error('❌ Failed to get recipe count:', error);
    return 0;
  }
};


