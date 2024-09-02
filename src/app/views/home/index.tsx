"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

const HomePage = () => {
  const router = useRouter();
  const handleBook = () => {
    router.push("/property");
  };
  return (
    <section className="bg-gray-100 py-16 min-h-screen">
      <div className="container mx-auto px-6 md:px-12 lg:flex lg:items-center">
        <div className="lg:w-1/2 lg:mr-12">
          <p className="text-sm text-blue-500 font-medium mb-2">
            Real Estate Agency
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Find Your Dream House With Us
          </h2>
          <p className="text-gray-600 mb-8">
            Discover your ideal rental property effortlessly. Our platform
            offers a curated selection of the best rental options to suit your
            needs.
          </p>
          <button
            className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition duration-300"
            onClick={handleBook}
          >
            Book Now
          </button>
        </div>
        <div className="lg:w-1/2 mt-8 lg:mt-0">
          <Image
            src="https://res.cloudinary.com/ddlpde95c/image/upload/v1725023546/hero-banner_x31z1f.png"
            alt="Modern house model"
            width={800}
            height={500}
            className="w-full h-auto rounded-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default HomePage;
