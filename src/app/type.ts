export type UserPayload = {
  email: string;
  password: string;
  name?: string;
};

export type Property = {
  id: number;
  location: string;
  bedrooms: number;
  price: number;
};

export type QueryResult = {
  data: Property[] | undefined;
  isLoading: boolean;
};

export type CartPayload = {
  userId: string | null;
  propertyId: string | string[];
  checkInDate: string | undefined;
  checkOutDate: string | undefined;
};


export type RemoveCartPayload = {
  userId: string | null;
  cartId: string;
  cartItemId: string;
};

export type CartItem = {
  id: string;
  property: Property;
};

export type CartData = {
  cartItems: CartItem[];
  totalCost: number;
};
