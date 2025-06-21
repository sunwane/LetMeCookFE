import { Category, sampleCategories } from "./Category";

export interface SubCategoryItem {
    id: string;
    name: string;
    imageUrl: string;
    category?: Category;
}

export const sampleSubCategories: SubCategoryItem[] = [
    {
      id: '1',
      name: 'Bánh Mì',
      imageUrl: 'https://cdn.xanhsm.com/2025/01/125f9835-banh-mi-sai-gon-thumb.jpg',
    },
    {
      id: '2',
      name: 'Phở',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxsNsnAt3VYWE4z5Eyej4-mc6Gn2JuFwIOQQ&s',
      category: sampleCategories[0],
    },
    {
      id: '3',
      name: 'Matcha',
      imageUrl: 'https://images.prismic.io/nutriinfo/aBHRb_IqRLdaBvL5_hinh-anh-matcha-latte.jpg?auto=format,compress',
      category: sampleCategories[4],
    },
    {
      id: '4',
      name: 'Cơm chiên',
      imageUrl: 'https://baolamdong.vn/file/e7837c02845ffd04018473e6df282e92/052023/1.com-tam-viet-nam-hap-dan-du-khach-khi-den-da-lat-2_20230529114050.jpg',
      category: sampleCategories[3],
    },
    {
      id: '5',
      name: 'Bánh Ngọt',
      imageUrl: 'https://friendshipcakes.com/wp-content/uploads/2022/03/2-4-1.jpg',
    },
    {
      id: '6',
      name: 'Các món thịt Bò',
      imageUrl: 'https://www.hoidaubepaau.com/wp-content/uploads/2018/07/bo-bit-tet-kieu-viet-nam.jpg',
      category: sampleCategories[1],
    },
    {
      id: '7',
      name: 'Các món Gà Rán',
      imageUrl: 'https://cokhiviendong.com/wp-content/uploads/2019/01/kinnh-nghi%E1%BB%87m-m%E1%BB%9F-qu%C3%A1n-g%C3%A0-r%C3%A1n-7.jpg',
      category: sampleCategories[1],
    },
    {
      id: '8',
      name: 'Tokkbokki',
      imageUrl: 'https://daesang.vn/upload/photos/shares/a1.jpg',
    },
    {
      id: '9',
      name: 'Mì',
      imageUrl: 'https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/2023_10_2_638318510704271571_ca-ch-la-m-mi-y-00.jpg',
      category: sampleCategories[0],
    },
    {
      id: '10',
      name: 'Lẩu chay',
      imageUrl: 'https://bearvietnam.vn/wp-content/uploads/2023/11/cach-nau-lau-chay.png',
      category: sampleCategories[2],
    },
    {
      id: '11',
      name: 'Thịt người thực vật',
      imageUrl: 'https://bearvietnam.vn/wp-content/uploads/2023/11/cach-nau-lau-chay.png',
      category: sampleCategories[1],
    },
    {
      id: '12',
      name: 'Cơm trộn',
      imageUrl: 'https://bearvietnam.vn/wp-content/uploads/2023/11/cach-nau-lau-chay.png',
      category: sampleCategories[3],
    },
    // Thêm các món khác...
  ];