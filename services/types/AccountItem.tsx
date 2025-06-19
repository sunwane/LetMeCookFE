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
    userBirthday: '20/05/2000'
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
    userBirthday: '10/03/1995'
  }
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
    const response = await fetch(`${API_BASE_URL}/accounts/send-code?email=${email}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const apiResponse: ApiResponse<string> = await response.json();
    return apiResponse.message || 'Mã xác thực đã được gửi';
  } catch (error) {
    console.error('❌ Failed to send code:', error);
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