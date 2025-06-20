import { API_BASE_URL } from '../../constants/api';

// ===== EXISTING INTERFACES (keep for sample data) =====
export interface AccountItem {
  id: number;
  userName: string;
  avatar: string;
  sex: string;
  age: number;
  height: number;
  weight: number;
  diet: string;
  userBirthday: string;
  email?: string; // Optional for sample data
}

export const sampleAccounts: AccountItem[] = [
  {
    id: 1,
    userName: "BếpTrưởngTậpSự",
    avatar: "https://randomuser.me/api/portraits/women/17.jpg",
    sex: "Nữ",
    age: 25,
    height: 165,
    weight: 55,
    diet: "Eat clean",
    userBirthday: '20/05/2000',
    email: "beptruong@gmail.com"
  },
  {
    id: 2,
    userName: "ĐầuBếpNhíNhố",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    sex: "Nam",
    age: 30,
    height: 175,
    weight: 70,
    diet: "Balanced",
    userBirthday: '10/03/1995',
    email: "daubepnhi@gmail.com"
  },
  {
    id: 3,
    userName: "ChefAnNa",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    sex: "Nữ",
    age: 28,
    height: 160,
    weight: 52,
    diet: "Vegetarian",
    userBirthday: '15/07/1996',
    email: "chefanna@gmail.com"
  },
  {
    id: 4,
    userName: "MasterCook99",
    avatar: "https://randomuser.me/api/portraits/men/25.jpg",
    sex: "Nam",
    age: 35,
    height: 180,
    weight: 75,
    diet: "Keto",
    userBirthday: '22/11/1989',
    email: "mastercook99@gmail.com"
  },
  {
    id: 5,
    userName: "FoodieQueen",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    sex: "Nữ",
    age: 26,
    height: 168,
    weight: 58,
    diet: "Mediterranean",
    userBirthday: '08/09/1998',
    email: "foodiequeen@gmail.com"
  },
];

// ===== BACKEND API INTERFACES =====
export interface AccountCreationRequest {
  username : string;
  email: string;
  password: string;
  code: string;

}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
}

export interface AccountResponse {
  id: string;
  email: string;
  username?: string;
  status: 'ACTIVE' | 'BANNED';
  createdAt: string;
  banEndDate?: string;
  roles: Array<{ name: string; description: string; permissions: any[] }>;
}

export interface EmailResponse {
  id: string;
  email: string;
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

// POST /accounts/send-code
export const sendCodeAPI = async (email: string): Promise<string> => {
  try {
    console.log(`🌐 Sending verification code to: ${email}`);
    
    // ✅ FIX: Thêm email vào query parameter
    const response = await fetch(`${API_BASE_URL}/accounts/send-code?email=${encodeURIComponent(email)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // ❌ REMOVE body
    });

    console.log(`📥 Send code response: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Send code failed: ${response.status} - ${errorText}`);
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    const result = await response.json();
    return result.result || "Mã xác thực đã được gửi";
  } catch (error) {
    console.error('❌ Failed to send verification code:', error);
    throw error;
  }
};

// POST /accounts
export const createAccountAPI = async (data: AccountCreationRequest): Promise<AccountResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/accounts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const apiResponse: ApiResponse<AccountResponse> = await response.json();
    return apiResponse.result;
  } catch (error) {
    console.error('❌ Failed to create account:', error);
    throw error;
  }
};

// POST /accounts/request-password-reset
export const requestPasswordResetAPI = async (email: string): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/accounts/request-password-reset?email=${email}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const apiResponse: ApiResponse<string> = await response.json();
    return apiResponse.message || 'Mã xác nhận đổi mật khẩu đã được gửi';
  } catch (error) {
    console.error('❌ Failed to request password reset:', error);
    throw error;
  }
};

// POST /accounts/reset-password
export const resetPasswordAPI = async (data: ResetPasswordRequest): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/accounts/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const apiResponse: ApiResponse<void> = await response.json();
    return apiResponse.message || 'Password reset successful';
  } catch (error) {
    console.error('❌ Failed to reset password:', error);
    throw error;
  }
};

// GET /accounts (with pagination)
export const getAllAccountsAPI = async (page = 0, size = 3): Promise<Page<AccountResponse>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/accounts?page=${page}&size=${size}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header when needed
        // 'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const apiResponse: ApiResponse<Page<AccountResponse>> = await response.json();
    return apiResponse.result;
  } catch (error) {
    console.error('❌ Failed to fetch accounts:', error);
    throw error;
  }
};

// GET /accounts/{accountId}
export const getAccountByIdAPI = async (accountId: string): Promise<AccountResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/accounts/${accountId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const apiResponse: ApiResponse<AccountResponse> = await response.json();
    return apiResponse.result;
  } catch (error) {
    console.error('❌ Failed to fetch account:', error);
    throw error;
  }
};

// DELETE /accounts/{accountId}
export const deleteAccountAPI = async (accountId: string): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/accounts/${accountId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const apiResponse: ApiResponse<string> = await response.json();
    return apiResponse.result;
  } catch (error) {
    console.error('❌ Failed to delete account:', error);
    throw error;
  }
};

// POST /accounts/{accountId}/manage
export const manageAccountAPI = async (
  accountId: string, 
  action: 'ban' | 'activate',
  days?: number
): Promise<string> => {
  try {
    let url = `${API_BASE_URL}/accounts/${accountId}/manage?action=${action}`;
    if (days) {
      url += `&days=${days}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const apiResponse: ApiResponse<string> = await response.json();
    return apiResponse.message || 'Account managed successfully';
  } catch (error) {
    console.error('❌ Failed to manage account:', error);
    throw error;
  }
};

// GET /accounts/search
export const searchByEmailAPI = async (keyword: string): Promise<EmailResponse[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/accounts/search?keyword=${keyword}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const apiResponse: ApiResponse<EmailResponse[]> = await response.json();
    return apiResponse.result;
  } catch (error) {
    console.error('❌ Failed to search accounts:', error);
    throw error;
  }
};