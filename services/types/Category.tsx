export interface Category {
    id: number;
    name: string;
    icon?: string;
  }

export const sampleCategories: Category[] = [
  { id: 1, name: 'Bún, Mì, Phở', icon: 'abc'},
  { id: 2, name: 'Thịt', icon: 'abc' },
  { id: 3, name: 'Món chay', icon: 'abc' },
  { id: 4, name: 'Cơm', icon: 'abc' },
  { id: 5, name: 'Thức uống', icon: 'abc' },
]