export type Category =
  | "men's clothing"
  | "women's clothing"
  | "accessories"
  | null;

export type Product = {
  id: string;
  name: string;
  category: string;
  brand: string;
  imageUrl: string;
  price: string;
  originalPrice: string;
  discount: string;
};

export type OrderInfo = {
  fullname: string;
  pincode: string;
  address: string;
  city: string;
  phone: string;
};

export type Order = {
  id: string;
  product: Product;
  quantity: number;
  orderInfo: OrderInfo;
  createdOn: string;
};

export type CartItem = {
  id: string;
  product: Product;
  quantity: number;
};
