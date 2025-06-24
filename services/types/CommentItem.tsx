import { API_BASE_URL } from "@/constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AccountItem } from "./AccountItem";
import { RecipeItem } from "./RecipeItem";

export interface CommentItem {
    id: string;
    commentText: string;
    accountId: String;
    username: string;
    recipeId: String;
    userAvatar: string;
    likes: number;
    recipeTitle: string;
    createdAt: string;
    account: AccountItem;
    recipe: RecipeItem;
  }

export interface CommentRequest{
    commentText: string;
  } 


 export interface likeComment {
   id: string;
   commentId: string;
   accountId: string;
   accountName: string;
  
 }

  interface Page<T> {
  content: T[];
  totalElements: number; // Tổng số bình luận
  totalPages: number; // Tổng số trang
  size: number; // Số lượng phần tử trên mỗi trang
  number: number; // Số trang hiện tại (bắt đầu từ 0)
  first: boolean; // Có phải trang đầu tiên không
  last: boolean; // Có phải trang cuối cùng không
}

export const sampleComments: CommentItem[] = [

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

export const getAccountIdFromToken = async (): Promise<string | null> => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return null;
    }
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    // accountId có thể là 'accountId' hoặc 'sub' tùy backend
    return decoded.id || decoded.sub || null;
  } catch (e) {
    return null;
  }
};

export const createComment = async (recipeId: string, commentText: string): Promise<CommentItem> => {
  const token = await getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/comments/${recipeId}`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ commentText }),
  });

  return handleResponse(response);
}


export const getCommentsByRecipeId = async (recipeId: string, page: number = 0, size: number = 10): Promise<Page<CommentItem>> => {
  const token = await getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/comments/recipe/${recipeId}?page=${page}&size=${size}`, {
    method: 'GET',
    headers,
  });

  return handleResponse(response);
};


export const deleteComment = async (commentId: string): Promise<void> => {
  const token = await getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
    method: 'DELETE',
    headers,
  });

  // Chỉ cần kiểm tra response.ok, KHÔNG parse body
  if (!response.ok) {
    let errorText = '';
    try {
      errorText = await response.text();
    } catch {}
    throw new Error(errorText || 'Xóa bình luận thất bại!');
  }
  // Nếu thành công thì không cần return gì cả
};

export const getAllComments = async (page: number = 0, size: number = 10): Promise<Page<CommentItem>> => {
  const token = await getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/comments/all?page=${page}&size=${size}`, {
    method: 'GET',
    headers,
  });

  return handleResponse(response);
}

export const updateComment = async(commentId: string, RecipId: string, data: CommentRequest): Promise<CommentItem> => {
  const token = await getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/comments/${RecipId}/${commentId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data),
  });

  return handleResponse(response);
}

//like comment
export const likeComment = async (commentId: string): Promise<likeComment> => {
  const token = await getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/likeComment/create/${commentId}`, {
    method: 'POST',
    headers,
    body: JSON.stringify({}),
  });

  return handleResponse(response);
};

export const unlikeComment = async (commentId: string): Promise<void> => {
  const token = await getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/likeComment/dislike/${commentId}`, {
    method: 'DELETE',
    headers,
  });

  if (!response.ok) {
    let errorText = '';
    try {
      errorText = await response.text();
    } catch {}
    throw new Error(errorText || 'Hủy thích bình luận thất bại!');
  }
}

export const getAllAccountLikeComment = async (): Promise<likeComment[]> => {
  const token = await getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/likeComment/getAll`, {
    method: 'GET',
    headers,
  });

  return handleResponse(response);
}