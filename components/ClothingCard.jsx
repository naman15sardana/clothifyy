export default function ClothingCard({ item, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer border rounded-lg p-4 transition
        ${selected ? "border-black ring-2 ring-black" : "border-gray-300"}
      `}
    >
      {/* Image container */}
      <div className="w-full h-100 flex items-center justify-center bg-gray-50">
        <img
          src={item.image}
          alt={item.name}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      <p className="mt-2 text-center font-medium">{item.name}</p>
    </div>
  );
}
