import { Category, sampleCategories } from "./Category";
import { sampleSubCategories, SubCategoryItem } from "./SubCategoryItem";

export interface RecipeItem {
  id: string;
  foodName: string;
  imageUrl: string;
  difficulty: string;
  cookingTime: string;
  likes: number;
  description?: string;
  category?: Category;
  subCategory?: SubCategoryItem; 
  status?: boolean,
  userID?: string,
  createAt?: string; // Thêm trường createAt
}

//file riêng
export const foodData: RecipeItem[] = [
  {
    id: '1',
    foodName: 'Bánh Mì Ram Ram',
    imageUrl: 'https://cdn.xanhsm.com/2025/01/125f9835-banh-mi-sai-gon-thumb.jpg',
    difficulty: 'Dễ',
    cookingTime: '50m',
    likes: 100,
    subCategory: sampleSubCategories[0],
    createAt: '2024-12-15',
  },
  {
    id: '2',
    foodName: 'Phở Bò',
    imageUrl: 'https://bizweb.dktcdn.net/100/479/802/files/ham-luong-calo-trong-pho-bo-1024x712-jpeg.jpg?v=1722918596207',
    difficulty: 'Trung bình',
    cookingTime: '2h30m',
    likes: 150,
    category: sampleCategories[0],
    subCategory: sampleSubCategories[1],
    createAt: '2024-12-10',
  },
  {
    id: '3',
    foodName: 'Mì Ý công thức Jollibee',
    imageUrl: 'https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/2023_10_2_638318510704271571_ca-ch-la-m-mi-y-00.jpg',
    difficulty: 'Dễ',
    cookingTime: '1h50m',
    likes: 100,
    category: sampleCategories[0],
    subCategory: sampleSubCategories[8],
    createAt: '2024-12-08',
  },
  {
    id: '4',
    foodName: 'Mì xào giòn',
    imageUrl: 'https://sieuthisaigon.com.vn/upload/source/dichvu/c%C3%B4ng%20th%E1%BB%A9c%20n%E1%BA%A5u%20%C4%83n/mon%20man/mi%20xao%20gion/mi-xao-gion.jpg',
    difficulty: 'Dễ',
    cookingTime: '30m',
    likes: 150,
    category: sampleCategories[0],
    subCategory: sampleSubCategories[8],
    createAt: '2024-12-05',
  },
  {
    id: '5',
    foodName: 'Bò né',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAs7Ab1hpYRXQIcjuGVnxrQZ8k8FZH4KdrfQ&s',
    difficulty: 'Dễ',
    cookingTime: '1h50m',
    likes: 100,
    category: sampleCategories[1],
    subCategory: sampleSubCategories[5],
    createAt: '2024-12-03',
  },
  {
    id: '6',
    foodName: 'Mì bò Đài Loan',
    imageUrl: 'https://pos.nvncdn.com/3a420a-79556/art/artCT/20210222_bWtkmwrEt3QeViVW0JH50mgR.jpg',
    difficulty: 'Trung bình',
    cookingTime: '3h30m',
    likes: 150,
    category: sampleCategories[0],
    subCategory: sampleSubCategories[8],
    createAt: '2024-11-28',
  },
  {
    id: '7',
    foodName: 'Cơm chiên hải sản',
    imageUrl: 'https://saithanhfoods.vn/wp-content/uploads/2024/10/image-13.jpeg',
    difficulty: 'Dễ',
    cookingTime: '1h50m',
    likes: 100,
    category: sampleCategories[3],
    subCategory: sampleSubCategories[3],
    createAt: '2024-11-25',
  },
  {
    id: '8',
    foodName: 'Lẩu nấm chay',
    imageUrl: 'https://nhahangmocnhien.vn/wp-content/uploads/2023/10/Cach-nau-lau-chay-thap-cam.jpg',
    difficulty: 'Trung bình',
    cookingTime: '5h30m',
    likes: 150,
    category: sampleCategories[2],
    subCategory: sampleSubCategories[11],
    createAt: '2024-11-20',
  },
  {
    id: '9',
    foodName: 'Cơm tấm sườn bì chả',
    imageUrl: 'https://baolamdong.vn/file/e7837c02845ffd04018473e6df282e92/052023/1.com-tam-viet-nam-hap-dan-du-khach-khi-den-da-lat-2_20230529114050.jpg',
    difficulty: 'Trung bình',
    cookingTime: '2h00m',
    likes: 200,
    category: sampleCategories[3], // Cơm
    subCategory: sampleSubCategories[3], // Cơm chiên
    createAt: '2024-11-15',
  },
];