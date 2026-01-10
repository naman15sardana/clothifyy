"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import UploadPhoto from "@/components/UploadPhoto";
import ResultPreview from "@/components/ResultPreview";

const fallbackProduct = {
  title: "Demo Hoodie",
  price: "$78",
  category: "Hoodies",
  image:
    "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=800&auto=format&fit=crop",
};

async function fileFromUrl(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch product image");
  }
  const blob = await response.blob();
  const name = url.split("/").pop() || "product.jpg";
  return new File([blob], name, { type: blob.type || "image/jpeg" });
}

function TryOnContent() {
  const searchParams = useSearchParams();
  const paramsKey = useMemo(() => searchParams.toString(), [searchParams]);

  const [product, setProduct] = useState(fallbackProduct);
  const [userFile, setUserFile] = useState(null);
  const [userPreview, setUserPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState({
    tryOnImage: "",
    recommendedSize: null,
    fitNotes: null,
    styleNotes: null,
    confidence: null,
  });

  useEffect(() => {
    const title = searchParams.get("title");
    const price = searchParams.get("price");
    const image = searchParams.get("image");
    const category = searchParams.get("category");
    const productUrl = searchParams.get("productUrl");

    if (title || price || image || category) {
      setProduct({
        title: title ? decodeURIComponent(title) : "Product",
        price: price ? decodeURIComponent(price) : "",
        image: image ? decodeURIComponent(image) : fallbackProduct.image,
        category: category ? decodeURIComponent(category) : "",
        productUrl: productUrl ? decodeURIComponent(productUrl) : "",
      });
      return;
    }

    const stored = typeof window !== "undefined"
      ? window.localStorage.getItem("selectedClothes")
      : null;
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.length) {
          const first = parsed[0];
          setProduct({
            title: first.name || "Product",
            price: first.price || "",
            image: first.image || fallbackProduct.image,
            category: first.category || "",
          });
          return;
        }
      } catch (err) {
        console.warn("Failed to read local selection", err);
      }
    }

    setProduct(fallbackProduct);
  }, [paramsKey, searchParams]);

  const handlePhotoChange = (file, preview) => {
    setUserFile(file);
    setUserPreview(preview);
    setError("");
  };

  const handleGenerate = async () => {
    if (!userFile) {
      setError("Please upload your photo first.");
      return;
    }

    setLoading(true);
    setStatus("Generating with Gemini…");
    setError("");

    try {
      const formData = new FormData();
      formData.append("userImage", userFile);
      formData.append("title", product.title || "");
      formData.append("price", product.price || "");
      formData.append("category", product.category || "");

      const productImageUrl =
        product.image?.startsWith("/") && typeof window !== "undefined"
          ? `${window.location.origin}${product.image}`
          : product.image;

      let productSent = false;
      if (product.image) {
        try {
          const productFile = await fileFromUrl(product.image);
          formData.append("productImage", productFile);
          productSent = true;
        } catch (err) {
          console.warn("Falling back to product image URL", err);
        }
      }
      if (!productSent && productImageUrl) {
        formData.append("productImageUrl", productImageUrl);
      }

      const response = await fetch("/api/tryon", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate preview");
      }

      setResult({
        tryOnImage: data.tryOnImage || "",
        recommendedSize: data.recommendedSize ?? null,
        fitNotes: data.fitNotes ?? null,
        styleNotes: data.styleNotes ?? null,
        confidence: data.confidence ?? null,
      });
      setStatus("Preview ready");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-gray-900">Virtual Try-On</h1>
          <p className="text-gray-600">
            Upload your photo and let Gemini visualize the product on you.
          </p>
          {status ? (
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm text-emerald-700">
              {status}
            </div>
          ) : null}
          {error ? (
            <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-sm text-red-700">
              {error}
            </div>
          ) : null}
        </div>

        <div className="grid gap-4 md:grid-cols-[1.1fr_1fr]">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm uppercase tracking-wide text-gray-500">
                  Product
                </p>
                <h2 className="text-xl font-semibold text-gray-900">
                  {product.title}
                </h2>
                {product.price ? (
                  <p className="text-gray-700">{product.price}</p>
                ) : null}
                {product.category ? (
                  <p className="text-sm text-gray-600">{product.category}</p>
                ) : null}
                {product.productUrl ? (
                  <a
                    href={product.productUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-sm text-blue-600 hover:underline"
                  >
                    View product
                  </a>
                ) : null}
              </div>
              <div className="h-32 w-24 overflow-hidden rounded-lg bg-gray-100">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-gray-500">
                    No image
                  </div>
                )}
              </div>
            </div>
          </div>

          <UploadPhoto onChange={handlePhotoChange} preview={userPreview} />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleGenerate}
            disabled={loading || !userFile}
            className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white shadow disabled:bg-gray-400"
          >
            {loading ? "Generating…" : "Generate Try-On"}
          </button>
        </div>

        <ResultPreview
          image={result.tryOnImage}
          recommendedSize={result.recommendedSize}
          fitNotes={result.fitNotes}
          styleNotes={result.styleNotes}
          confidence={result.confidence}
          loading={loading}
        />
      </div>
    </main>
  );
}

export default function TryOnPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gray-50 p-6 text-gray-600">
          Loading try-on…
        </main>
      }
    >
      <TryOnContent />
    </Suspense>
  );
}
