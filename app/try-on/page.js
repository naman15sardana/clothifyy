"use client";

import Image from "next/image";
import { clothes } from "../data/clothes";

export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Choose an outfit</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {clothes.map((item) => (
          <div key={item.id} className="border rounded-lg p-3">
            <Image
              src={item.image}
              alt={item.name}
              width={200}
              height={250}
              className="object-contain"
            />
            <p className="text-center mt-2">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
