import { API_BASE_URL } from '../../constants/api';

// ===== API INTERFACES =====
export interface AuthRequest {
  email: string;
  password: string;
}

export interface GoogleSignInRequest {
  token: string;
}

export interface IntrospectRequest {
  token: string;
}

export interface LogoutRequest {
  token: string;
}

export interface RefreshRequest {
  token: string;
}

export interface AuthResponse {
  authenticated: boolean;
  token: string;
  refreshToken: string;
}

export interface IntrospectResponse {
  valid: boolean;
  scope?: string;
  issuer?: string;
  audience?: string;
  username?: string;
  tokenType?: string;
}

export interface ApiResponse<T> {
  result: T;
  code?: number;
  message?: string;
}


// POST /auth/token
export const loginAPI = async (data: AuthRequest): Promise<AuthResponse> => {
  try {
    const url = `${API_BASE_URL}/auth/token`;
    console.log("🔥 API URL:", url);
    console.log("📤 Request data:", data);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    console.log("📊 Response status:", response.status);
    console.log("📊 Response ok:", response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log("❌ Error response:", errorText);
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    const responseText = await response.text();
    console.log("📥 Raw response:", responseText);
    
    const apiResponse: ApiResponse<AuthResponse> = JSON.parse(responseText);
    console.log("✅ Parsed response:", apiResponse);
    
    return apiResponse.result;
  } catch (error) {
    console.error('❌ Login API Error:', error);
    console.error('❌ Error details:', {
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
};

// POST /auth/google
export const googleSignInAPI = async (data: GoogleSignInRequest): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const apiResponse: ApiResponse<AuthResponse> = await response.json();
    return apiResponse.result;
  } catch (error) {
    console.error('❌ Google sign-in failed:', error);
    throw error;
  }
};

// POST /auth/introspect
export const introspectAPI = async (data: IntrospectRequest): Promise<IntrospectResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/introspect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const apiResponse: ApiResponse<IntrospectResponse> = await response.json();
    return apiResponse.result;
  } catch (error) {
    console.error('❌ Token introspection failed:', error);
    throw error;
  }
};

// POST /auth/logout
export const logoutAPI = async (data: LogoutRequest): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('❌ Logout failed:', error);
    throw error;
  }
};

// POST /auth/refresh
export const refreshTokenAPI = async (data: RefreshRequest): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const apiResponse: ApiResponse<AuthResponse> = await response.json();
    return apiResponse.result;
  } catch (error) {
    console.error('❌ Token refresh failed:', error);
    throw error;
  }
};