"use client";
import { FoodItem } from "@/types/types";
import FoodCard from "@/components/foodCard/FoodCard";

export default function FoodList({ foodItems }: { foodItems: FoodItem[] }) {
  // Group items by category
  const categorized: Record<string, FoodItem[]> = {};
  const uncategorized: FoodItem[] = [];

  foodItems.forEach((item) => {
    if (item.category) {
      if (!categorized[item.category]) categorized[item.category] = [];
      categorized[item.category].push(item);
    } else {
      uncategorized.push(item);
    }
  });

  const categories = Object.keys(categorized);

  return (
    <div className="space-y-8">
      {/* Categories first */}
      {categories.map((cat) => (
        <div key={cat}>
          <h2 className="text-2xl font-bold mb-4 text-right">{cat}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categorized[cat].map((item) => (
              <FoodCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      ))}

      {/* Uncategorized last */}
      {uncategorized.length > 0 && (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {uncategorized.map((item) => (
              <FoodCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
