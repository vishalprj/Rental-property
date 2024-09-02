"use client";
import Card from "@/app/components/card";
import { useGetPropertyListing } from "@/app/store/queries";
import { useState, useEffect } from "react";
import { BarLoader } from "react-spinners";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { Property, QueryResult } from "@/app/type";

export default function Properties() {
  const { data: propertiesData, isLoading }: QueryResult =
    useGetPropertyListing();
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [location, setLocation] = useState<string>("");
  const [bedrooms, setBedrooms] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);

  useEffect(() => {
    if (propertiesData) {
      setFilteredProperties(propertiesData);
    }
  }, [propertiesData]);

  const handleFilter = () => {
    let filtered = propertiesData || [];

    if (location) {
      filtered = filtered.filter((property) => property.location === location);
    }

    if (bedrooms) {
      filtered = filtered.filter(
        (property) => property.bedrooms === parseFloat(bedrooms)
      );
    }

    if (priceRange) {
      filtered = filtered.filter(
        (property) =>
          property.price >= priceRange[0] && property.price <= priceRange[1]
      );
    }

    setFilteredProperties(filtered);
  };

  const handleReset = () => {
    setLocation("");
    setBedrooms("");
    setPriceRange([0, 100000]);
    setFilteredProperties(propertiesData || []);
  };

  const handleSliderChange = (value: number | number[]) => {
    if (Array.isArray(value)) {
      setPriceRange(value as [number, number]);
    }
  };

  if (isLoading) {
    return <BarLoader className="mb-4" width={"100%"} color="#1D4ED8" />;
  }

  return (
    <div className="container mx-auto p-6 flex flex-col md:flex-row">
      {/* Filters Section */}
      <div className="w-full md:w-1/4 bg-white p-6 rounded-lg shadow-lg mb-8 md:mb-0 md:mr-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Filter Properties
        </h2>
        <div className="space-y-4">
          <select
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="">Location</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Bangalore">Bangalore</option>
          </select>

          <select
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
          >
            <option value="">Bedrooms</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Price Range
            </label>
            <Slider
              range
              min={0}
              max={100000}
              step={1000}
              value={priceRange}
              onChange={handleSliderChange}
              className="w-full"
            />
            <div className="flex justify-between text-sm mt-2 text-gray-700">
              <span>₹{priceRange[0]}</span>
              <span>₹{priceRange[1]}</span>
            </div>
          </div>
        </div>

        <button
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 w-full"
          onClick={handleFilter}
        >
          Apply Filters
        </button>

        <button
          className="mt-4 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300 w-full"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>

      <div className="w-full md:w-3/4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.length ? (
            filteredProperties.map((data) => (
              <Card key={data.id} property={data} />
            ))
          ) : (
            <p>No properties found</p>
          )}
        </div>
      </div>
    </div>
  );
}
