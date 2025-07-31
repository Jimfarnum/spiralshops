import { Link } from "wouter";
import { ShoppingBag, Coffee, Utensils, Heart, Shirt, Home, Gamepad2, Book } from "lucide-react";

const categories = [
  { name: "Fashion & Apparel", icon: Shirt, href: "/products?category=fashion", color: "from-pink-500 to-purple-500" },
  { name: "Food & Dining", icon: Utensils, href: "/products?category=food", color: "from-orange-500 to-red-500" },
  { name: "Coffee & Beverages", icon: Coffee, href: "/products?category=beverages", color: "from-amber-600 to-orange-600" },
  { name: "Health & Beauty", icon: Heart, href: "/products?category=health", color: "from-green-500 to-teal-500" },
  { name: "Home & Garden", icon: Home, href: "/products?category=home", color: "from-blue-500 to-indigo-500" },
  { name: "Electronics", icon: Gamepad2, href: "/products?category=electronics", color: "from-purple-500 to-blue-500" },
  { name: "Books & Media", icon: Book, href: "/products?category=books", color: "from-indigo-500 to-purple-500" },
  { name: "All Categories", icon: ShoppingBag, href: "/products", color: "from-gray-600 to-gray-800" }
];

export default function RetailerCategoryMenu() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Shop by Category</h3>
      <div className="space-y-3">
        {categories.map((category) => {
          const IconComponent = category.icon;
          return (
            <Link key={category.name} href={category.href}>
              <div className={`flex items-center p-3 rounded-lg bg-gradient-to-r ${category.color} text-white hover:shadow-lg transition-all duration-200 cursor-pointer group`}>
                <IconComponent className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-sm">{category.name}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}