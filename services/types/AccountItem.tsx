export interface AccountItem {
    id: number;
    userName: string;
    email?: string; // Optional email field
    avatar: string;
    sex: string;
    age: number;
    height: number;
    weight: number;
    diet: string;
    healthStatus: string;
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
    healthStatus: "Dị ứng tôm",
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
    healthStatus: "Tiểu đường",
    userBirthday: '10/03/1995'
  }
];