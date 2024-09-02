"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  useGetCartList,
  useRemoveCartItem,
  useUpdateCartItem,
} from "@/app/store/queries";
import DatePickerWithRange from "@/app/components/datapicker";
import { useState } from "react";
import { Loader2, XCircle } from "lucide-react";
import { DateRange } from "react-day-picker";
import toast from "react-hot-toast";
import { BarLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import useGetUser from "@/app/utils/useGetUser";

const Cart = () => {
  const { userId } = useGetUser();
  const { data, isLoading } = useGetCartList(userId);
  const { mutate: removeItem } = useRemoveCartItem();
  const { mutate: updateItem } = useUpdateCartItem();
  const cartItem = data?.cartItems;
  const totalCost = data?.totalCost;

  const [selectedDates, setSelectedDates] = useState<DateRange | undefined>();
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const handleCheckout = () => {
    router.push("/checkout");
  };

  const handleRemoveItem = async (itemId: string) => {
    const payload = {
      userId,
      cartId: cartItem?.[0]?.cartId,
      cartItemId: itemId,
    };
    removeItem(payload);
    toast.success("Removed from cart");
  };

  const handleDateChange = (dates: DateRange | undefined) => {
    setSelectedDates(dates);
  };

  const handleConfirm = async () => {
    if (!selectedItemId || !selectedDates?.from || !selectedDates?.to) {
      toast.error("Please select an item and dates before confirming.");
      return;
    }

    const selectedItem = cartItem?.find(
      (item: any) => item.id === selectedItemId
    );

    const payload = {
      userId,
      propertyId: selectedItem?.property.id,
      checkInDate: selectedDates?.from.toISOString(),
      checkOutDate: selectedDates?.to.toISOString(),
    };

    try {
      updateItem(payload);
      toast.success("Dates updated successfully.");
    } catch (error) {
      toast.error("Failed to update dates.");
    }

    setIsModalOpen(false);
  };

  if (!userId) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-4xl font-extrabold mb-6 text-gray-800">
          Please Log In
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          You need to log in to view your cart.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return <BarLoader className="mb-4" width={"100%"} color="#1D4ED8" />;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-extrabold mb-6 text-center md:text-left text-gray-800">
        Your Cart
      </h1>

      {cartItem?.length === 0 ? (
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">
            Your cart is empty. Add items to your cart to proceed.
          </p>
          <Button
            className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
            onClick={() => router.push("/property")}
          >
            Add Items
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {cartItem?.map((item: any) => (
            <div
              key={item.id}
              className="flex flex-col md:flex-row items-center justify-between p-6 border rounded-lg space-y-6 md:space-y-0 shadow-lg bg-white"
            >
              <div className="flex items-center space-x-6">
                <div className="relative w-28 h-28">
                  <Image
                    src={item.property.images[0]}
                    alt={item.property.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {item.property.title}
                  </h2>
                  <p className="text-lg text-gray-600">
                    ₹{item.property.price} / Per Day
                  </p>
                  <p
                    className="text-sm text-blue-600 cursor-pointer mt-2"
                    onClick={() => {
                      setSelectedItemId(item.id);
                      setIsModalOpen(true);
                    }}
                  >
                    Want to change your check-in and check-out dates?{" "}
                    <span className="text-red-500">Price may be differ </span>{" "}
                    Click here.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <Button
                  onClick={() => handleRemoveItem(item.id)}
                  variant="destructive"
                  className="flex items-center space-x-2"
                >
                  <XCircle className="h-5 w-5" />
                  <span>Remove</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Select Dates</h2>
            <DatePickerWithRange onDateChange={handleDateChange} />
            <div className="mt-4 flex justify-end space-x-4">
              <Button
                onClick={handleConfirm}
                className="bg-blue-600 text-white"
              >
                Confirm
              </Button>
              <Button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-6 py-2 rounded-lg transition-colors duration-300"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {cartItem && cartItem.length > 0 && (
        <div className="mt-10 text-center md:text-right">
          <p className="text-3xl font-extrabold mb-6 text-gray-800">
            Total: ₹{totalCost}
          </p>
          <Button
            className="bg-gradient-to-r text-white px-8 py-4 rounded-lg hover:bg-gradient-to-r from-blue-700 to-blue-800 transition duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg"
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Proceeding to Checkout
              </>
            ) : (
              "Proceed to Checkout"
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Cart;
