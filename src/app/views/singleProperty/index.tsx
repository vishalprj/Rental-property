"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  addToCart,
  useGetCartList,
  useGetSingleProperty,
} from "@/app/store/queries";
import Image from "next/image";
import { useParams } from "next/navigation";
import DatePickerWithRange from "@/app/components/datapicker";
import { BarLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { DateRange } from "react-day-picker";
import useGetUser from "@/app/utils/useGetUser";

export default function SingleProperty() {
  const param = useParams();
  const { userId } = useGetUser();
  const { data: property, isLoading } = useGetSingleProperty(param?.id);

  const { data } = useGetCartList(userId);
  const [mainImage, setMainImage] = useState<string>(
    property?.images?.[0] || ""
  );
  const [selectedDates, setSelectedDates] = useState<DateRange | undefined>();
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const router = useRouter();
  const cartItems = data?.cartItems || [];

  const isInCart = cartItems.some(
    (item: { propertyId: string }) => item.propertyId === param.id
  );

  useEffect(() => {
    if (property?.images?.length > 0) {
      setMainImage(property.images[0]);
    }
  }, [property]);

  if (isLoading) {
    return <BarLoader className="mb-4" width={"100%"} color="#1D4ED8" />;
  }

  if (!property) {
    return <div className="text-center py-6">Property not found.</div>;
  }
  const handleAddToCart = async () => {
    if (!userId) {
      toast.error(
        "You need to be logged in to add items to your cart. Please log in first."
      );
      return;
    }

    setLoading(true);
    try {
      const payload = {
        userId,
        propertyId: param.id,
        checkInDate: selectedDates?.from?.toISOString(),
        checkOutDate: selectedDates?.to?.toISOString(),
      };
      await addToCart(payload);
      toast.success("Property added to the cart.");
      router.push("/cart");
    } catch (error) {
      toast.error("Failed to add the property to your cart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container p-6 md:p-12 ">
      <div className="flex flex-col md:flex-row md:space-x-8">
        <div className="w-full md:w-1/2 mb-6 md:mb-0">
          <div className="relative w-full h-72 md:h-96 rounded-lg overflow-hidden">
            <Image
              src={mainImage}
              alt={property.title}
              layout="fill"
              objectFit="cover"
              className="rounded-lg transition-transform duration-300 transform hover:scale-105"
            />
          </div>
          {property.images.length > 1 && (
            <div className="mt-4 flex overflow-x-auto space-x-2">
              {property.images.map((image: string, index: number) => (
                <div
                  key={index}
                  className="relative w-24 h-24 rounded-lg overflow-hidden cursor-pointer transition-transform duration-300 transform hover:scale-105"
                  onClick={() => setMainImage(image)}
                >
                  <Image
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="w-full md:w-1/2">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            {property.title}
          </h1>
          <p className="text-gray-700 mb-4 text-lg leading-relaxed">
            {property.description}
          </p>
          <div className="text-3xl font-semibold mb-4 text-blue-700">
            ₹{property.price}
          </div>
          <div className="text-gray-800 mb-4">
            <span className="font-medium">Location:</span> {property.location}
          </div>
          <div className="text-gray-800 mb-4">
            <span className="font-medium">Bedrooms:</span> {property.bedrooms}
          </div>
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2 text-gray-900">
              Amenities:
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {property.amenities.map((amenity: any, index: number) => (
                <li key={index} className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span>{amenity}</span>
                </li>
              ))}
            </ul>
          </div>

          {!isInCart ? (
            <>
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  Select Dates:
                </h3>
                <DatePickerWithRange onDateChange={setSelectedDates} />
              </div>

              <div className="mb-6 flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="confirm-checkbox"
                  checked={checked}
                  onChange={() => setChecked(!checked)}
                  className="h-5 w-5"
                />
                <label htmlFor="confirm-checkbox" className="text-gray-700">
                  I have selected the check-in and check-out dates.
                </label>
              </div>

              <Button
                onClick={handleAddToCart}
                className={`w-full ${!checked ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"} text-white px-6 py-3 rounded-lg transition duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300`}
                disabled={!checked}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding to your cart
                  </>
                ) : (
                  "Add to Cart"
                )}
              </Button>
            </>
          ) : (
            <Button
              onClick={() => router.push("/cart")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              Go to Cart
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
