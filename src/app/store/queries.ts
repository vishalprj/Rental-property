import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { CartPayload, RemoveCartPayload } from "../type";

// Login user
export const loginUser = async (payload: {
  email: string;
  password: string;
}) => {
  return axios.post("/api/user/login", payload);
};

// Register user
export const registerUser = async (payload: {
  email: string;
  password: string;
  name: string;
}) => {
  return axios.post("/api/user/signup", payload);
};

// Property listing
export const getPropertyListing = async () => {
  const res = await axios.get("/api/property");
  return res?.data;
};

export const useGetPropertyListing = () => {
  return useQuery("property", getPropertyListing);
};

// Fetch single property
export const getSingleProperty = async (id: string | string[]) => {
  const res = await axios.get(`/api/property/${id}`);
  return res?.data;
};

export const useGetSingleProperty = (id: string | string[]) => {
  return useQuery(["singleProperty", id], () => getSingleProperty(id), {
    enabled: !!id,
  });
};

// Add to cart
export const addToCart = async (payload: CartPayload) => {
  return axios.patch("/api/cart/add", payload);
};

// Get cart list
export const getCartList = async (userId: string | null) => {
  const res = await axios.post("/api/cart/list", { userId });
  return res.data?.cart;
};

export const useGetCartList = (userId: string | null) => {
  return useQuery(["cart", userId], () => getCartList(userId), {
    enabled: !!userId,
  });
};

// Remove cart item
export const removeCartItem = async (payload: RemoveCartPayload) => {
  return axios.patch("/api/cart/remove", payload);
};

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation(removeCartItem, {
    onSuccess: () => {
      queryClient.invalidateQueries("cart");
    },
    onError: () => {
      toast.error("Failed to update");
    },
  });
};

// Update cart item
export const updateCartItem = async (payload: CartPayload) => {
  return axios.patch("/api/cart/add", payload);
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation(updateCartItem, {
    onSuccess: () => {
      queryClient.invalidateQueries("cart");
    },
    onError: () => {
      toast.error("Failed to update");
    },
  });
};

// Delete cart item
export const deleteCartItem = async (payload: any) => {
  return axios.patch("/api/cart/delete", payload);
};
