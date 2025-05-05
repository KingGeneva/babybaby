
export interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price: string;
  url: string;
  category?: string;
  isNew?: boolean;
  isFeatured?: boolean;
  discount?: string;
}
