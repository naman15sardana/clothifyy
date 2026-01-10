const fallbackImage =
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop";

export default function ClothingCard({ item, selected, onSelect }) {
  return (
    <div
      className={`rounded-xl border p-4 shadow-sm transition ${
        selected ? "border-black ring-2 ring-black/40" : "border-gray-200"
      }`}
    >
      <div className="aspect-[4/5] overflow-hidden rounded-lg bg-gray-100">
        <img
          src={item.image}
          alt={item.name}
          onError={(event) => {
            event.currentTarget.src = fallbackImage;
          }}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div>
          <p className="font-semibold text-gray-900">{item.name}</p>
          {item.price ? (
            <p className="text-sm text-gray-600">{item.price}</p>
          ) : null}
        </div>
        <button
          onClick={() => onSelect(item)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            selected
              ? "bg-black text-white"
              : "bg-gray-200 text-gray-900 hover:bg-gray-300"
          }`}
        >
          {selected ? "Selected" : "Select"}
        </button>
      </div>
    </div>
  );
}
