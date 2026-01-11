"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { clothes } from "../data/clothes";
import ClothingCard from "../components/ClothingCard";


export default function Home() {
  const [selectedClothes, setSelectedClothes] = useState([]);
  const [productUrl, setProductUrl] = useState("");
  const [productLoading, setProductLoading] = useState(false);
  const [productError, setProductError] = useState("");
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

  const handleLoadUrl = async () => {
    const trimmed = productUrl.trim();
    if (!trimmed) {
      setProductError("Paste a product URL to load.");
      return;
    }
    setProductError("");
    setProductLoading(true);
    try {
      const response = await fetch("/api/product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to load product");
      }

      const params = new URLSearchParams();
      if (data.title) params.set("title", data.title);
      if (data.price) params.set("price", data.price);
      if (data.image) params.set("image", data.image);
      if (data.category) params.set("category", data.category);
      if (data.url) params.set("productUrl", data.url);

      router.push(`/try-on?${params.toString()}`);
    } catch (err) {
      setProductError(err.message || "Unable to load product URL");
    } finally {
      setProductLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-center mb-4">AI Virtual Try-On</h1>

      <p className="text-center mb-6 text-gray-600">
        Select up to 3 outfits to try on
      </p>

      <div className="mx-auto mb-10 flex max-w-3xl flex-col gap-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <div className="flex-1">
          <label className="text-xs uppercase tracking-wide text-gray-500">
            Try any product URL
          </label>
          <input
            type="url"
            value={productUrl}
            onChange={(e) => setProductUrl(e.target.value)}
            placeholder="Paste a product link (e.g. H&M product page)"
            className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          />
          {productError ? (
            <p className="mt-1 text-xs text-red-600">{productError}</p>
          ) : (
            <p className="mt-1 text-xs text-gray-500">
              We’ll fetch the title and image and take you to Try-On.
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={handleLoadUrl}
          disabled={productLoading}
          className="mt-2 rounded-full bg-black px-5 py-2 text-sm font-semibold text-white shadow disabled:bg-gray-400 sm:mt-5"
        >
          {productLoading ? "Loading…" : "Load & Try"}
        </button>
      </div>

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
