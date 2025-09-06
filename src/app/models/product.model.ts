export interface Product {
  _id: string;
  name: string;
  price: number;
}

export interface Products {
  _id?: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
}
