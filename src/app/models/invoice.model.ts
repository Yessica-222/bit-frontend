export interface InvoiceProduct {
  productId: string | { _id: string; name?: string };
  quantity: number;
}

export interface Invoice {
  _id?: string;
  userId: string | { _id: string; name?: string; email?: string };
  products: InvoiceProduct[];
  total: number;
  createdAt?: string | Date; // más claro que "any"
}
