import Image from "next/image";
import { useRouter } from "next/navigation";

const Card = ({ property }: any) => {
  const router = useRouter();

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full">
      <div className="transition-transform duration-300">
        <Image
          src={property.images[0]}
          alt={property.title}
          className="w-full h-48 object-cover"
          width={400}
          height={200}
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">
          {property.title}
        </h3>
        <p className="text-gray-600 mb-2">{property.description}</p>
        <p className="text-gray-800 font-semibold mb-4 flex items-center">
          ₹{property.price}{" "}
          <span className="text-blue-500 text-sm ml-2">/ per day</span>
        </p>
        <div className="mt-auto">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 w-full"
            onClick={() => router.push(`/property/${property.id}`)}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
