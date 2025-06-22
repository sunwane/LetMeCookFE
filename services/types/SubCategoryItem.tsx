import { API_BASE_URL } from "@/constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { sampleCategories } from "./Category";

export interface ApiResponse<T> {
  code?: number
  message?: string
  result: T
}

export interface SubCategoryItem {
    id: string;
    subCategoryName: string;
    subCategoryImg: string;
    categoryId?: string;
}


export const sampleSubCategories: SubCategoryItem[] = [
    {
      id: '1',
      subCategoryName: 'Bánh Mì',
      subCategoryImg: 'https://cdn.xanhsm.com/2025/01/125f9835-banh-mi-sai-gon-thumb.jpg',
    },
    {
      id: '2',
      subCategoryName: 'Phở',
      subCategoryImg: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxsNsnAt3VYWE4z5Eyej4-mc6Gn2JuFwIOQQ&s',
      categoryId: sampleCategories[0].id, // Assuming this belongs to the first category
    },
    {
      id: '3',
      subCategoryName: 'Matcha',
      subCategoryImg: 'https://images.prismic.io/nutriinfo/aBHRb_IqRLdaBvL5_hinh-anh-matcha-latte.jpg?auto=format,compress',
      categoryId: sampleCategories[4].id,
    },
    {
      id: '4',
      subCategoryName: 'Cơm chiên',
      subCategoryImg: 'https://baolamdong.vn/file/e7837c02845ffd04018473e6df282e92/052023/1.com-tam-viet-nam-hap-dan-du-khach-khi-den-da-lat-2_20230529114050.jpg',
      categoryId: sampleCategories[3].id,
    },
    {
      id: '5',
      subCategoryName: 'Bánh Ngọt',
      subCategoryImg: 'https://friendshipcakes.com/wp-content/uploads/2022/03/2-4-1.jpg',
    },
    {
      id: '6',
      subCategoryName: 'Các món thịt Bò',
      subCategoryImg: 'https://www.hoidaubepaau.com/wp-content/uploads/2018/07/bo-bit-tet-kieu-viet-nam.jpg',
      categoryId: sampleCategories[1].id,
    },
    {
      id: '7',
      subCategoryName: 'Các món Gà Rán',
      subCategoryImg: 'https://cokhiviendong.com/wp-content/uploads/2019/01/kinnh-nghi%E1%BB%87m-m%E1%BB%9F-qu%C3%A1n-g%C3%A0-r%C3%A1n-7.jpg',
      categoryId: sampleCategories[1].id,
    },
    {
      id: '8',
      subCategoryName: 'Tokkbokki',
      subCategoryImg: 'https://daesang.vn/upload/photos/shares/a1.jpg',
    },
    {
      id: '9',
      subCategoryName: 'Mì',
      subCategoryImg: 'https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/2023_10_2_638318510704271571_ca-ch-la-m-mi-y-00.jpg',
      categoryId: sampleCategories[0].id,
    },
    {
      id: '10',
      subCategoryName: 'Lẩu chay',
      subCategoryImg: 'https://bearvietnam.vn/wp-content/uploads/2023/11/cach-nau-lau-chay.png',
      categoryId: sampleCategories[2].id,
    },
    {
      id: '11',
      subCategoryName: 'Thịt người thực vật',
      subCategoryImg: 'https://bearvietnam.vn/wp-content/uploads/2023/11/cach-nau-lau-chay.png',
      categoryId: sampleCategories[1].id,
    },
    {
      id: '12',
      subCategoryName: 'Cơm trộn',
      subCategoryImg: 'https://bearvietnam.vn/wp-content/uploads/2023/11/cach-nau-lau-chay.png',
      categoryId: sampleCategories[3].id,
    },
    // Thêm các món khác...
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

export const getAllSubCategories = async (): Promise<ApiResponse<SubCategoryItem[]>> => {
  const token = await getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/subCategory/getAllSubCategory`, {
    method: 'GET',
    headers,
  });

  return handleResponse(response);
};

export const getTop6subcategories = async (): Promise<ApiResponse<SubCategoryItem[]>> => {
  const token = await getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/subCategory/getTop6SubCategory`, {
    method: 'GET',
    headers,
  });

  return handleResponse(response);
}