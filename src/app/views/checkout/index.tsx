"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { deleteCartItem, useGetCartList } from "@/app/store/queries";
import useGetUser from "@/app/utils/useGetUser";

export type CheckoutFormData = {
  name: string;
  email: string;
  phone: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
};

const Checkout = () => {
  const { userId } = useGetUser();
  const { data } = useGetCartList(userId);
  const cartItem = data?.cartItems;
  const totalCost = data?.totalCost;

  const [totalPrice, setTotalPrice] = useState(totalCost || 0);
  const [gst] = useState(0.18);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<CheckoutFormData>({ mode: "onChange" });

  useEffect(() => {
    if (totalCost !== undefined) {
      setTotalPrice(totalCost);
    }
  }, [totalCost]);

  const handleCheckout: SubmitHandler<CheckoutFormData> = async (data) => {
    setIsLoading(true);
    try {
      const payload = {
        cartId: cartItem?.[0]?.cartId,
      };
      await deleteCartItem(payload);
      toast.success("Booking confirmed!");
      router.push("/");
    } catch (error) {
      toast.error("Checkout failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const subtotal = totalPrice || 0;
  const tax = subtotal * gst;
  const finalTotal = subtotal + tax;

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-4xl font-extrabold mb-6 text-center text-gray-800">
        Checkout
      </h1>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold mb-4 text-blue-800">
              Contact Information
            </h2>
            <form
              id="checkout-form"
              className="space-y-4"
              onSubmit={handleSubmit(handleCheckout)}
            >
              <input
                type="text"
                placeholder="Name"
                {...register("name", { required: true })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Email"
                {...register("email", { required: true })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="tel"
                placeholder="Phone"
                {...register("phone", { required: true })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </form>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold mb-4 text-blue-800">
              Payment Information
            </h2>
            <form
              id="checkout-form"
              className="space-y-4"
              onSubmit={handleSubmit(handleCheckout)}
            >
              <input
                type="text"
                placeholder="Card Number"
                {...register("cardNumber", { required: true })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Expiry Date (MM/YY)"
                {...register("expiryDate", { required: true })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="CVV"
                {...register("cvv", { required: true })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </form>
          </div>
        </div>

        <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">
            Price Summary
          </h2>
          <div className="space-y-2">
            <p className="text-lg text-gray-800">
              Cost: ₹{subtotal.toFixed(2)}
            </p>
            <p className="text-lg text-gray-800">
              GST (18%): ₹{tax.toFixed(2)}
            </p>
            <p className="text-xl font-bold text-gray-800">
              Total: ₹{finalTotal.toFixed(2)}
            </p>
          </div>
          <div className="mt-6 text-center">
            <Button
              className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg"
              type="submit"
              form="checkout-form"
              onClick={handleSubmit(handleCheckout)}
              disabled={!isValid || isLoading}
            >
              {isLoading ? (
                <>
                  <span className="mr-2">Processing...</span>
                </>
              ) : (
                "Confirm and Pay"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
