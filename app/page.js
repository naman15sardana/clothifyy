"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { clothes } from "../data/clothes";
import ClothingCard from "../components/ClothingCard";

export default function Home() {
  const [selectedClothes, setSelectedClothes] = useState([]);
  const router = useRouter();

  const handleSelect = (item) => {
    const exists = selectedClothes.find((c) => c.id === item.id);

    if (exists) {
      setSelectedClothes(selectedClothes.filter((c) => c.id !== item.id));
    } else {
      if (selectedClothes.length >= 3) {
        alert("You can select up to 3 outfits only");
        return;
      }
      setSelectedClothes([...selectedClothes, item]);
    }
  };

  const handleTrySelected = () => {
    localStorage.setItem(
      "selectedClothes",
      JSON.stringify(selectedClothes)
    );
    router.push("/try-on");
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-center mb-4">
        AI Virtual Try-On
      </h1>

      <p className="text-center mb-6 text-gray-600">
        Select up to 3 outfits to try on
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {clothes.map((item) => (
          <ClothingCard
            key={item.id}
            item={item}
            selected={selectedClothes.some((c) => c.id === item.id)}
            onSelect={handleSelect}
          />
        ))}
      </div>

      <div className="flex justify-center mt-10">
        <button
          disabled={selectedClothes.length === 0}
          onClick={handleTrySelected}
          className="bg-black text-white px-8 py-3 rounded-xl disabled:bg-gray-400"
        >
          Try Selected ({selectedClothes.length})
        </button>
      </div>
    </main>
  );
}
