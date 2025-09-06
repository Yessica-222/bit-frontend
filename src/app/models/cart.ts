export interface CartItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;       // Total calculado
}
