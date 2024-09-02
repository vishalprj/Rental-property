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
