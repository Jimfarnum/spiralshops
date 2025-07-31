import { Link } from "wouter";
import { ShoppingBag, Coffee, Utensils, Heart, Shirt, Home, Gamepad2, Book, Star } from "lucide-react";
import { productCategories } from "@/data/productCategories";

const categories = [
  { name: "Apparel", icon: Shirt, href: "/products?category=apparel", color: "from-pink-500 to-purple-500", subcategories: productCategories.find(c => c.name === 'Apparel')?.subcategories || [] },
  { name: "Beauty & Wellness", icon: Heart, href: "/products?category=beauty", color: "from-green-500 to-teal-500", subcategories: productCategories.find(c => c.name === 'Beauty & Wellness')?.subcategories || [] },
  { name: "Home & Gifts", icon: Home, href: "/products?category=home", color: "from-blue-500 to-indigo-500", subcategories: productCategories.find(c => c.name === 'Home & Gifts')?.subcategories || [] },
  { name: "Tech & Gadgets", icon: Gamepad2, href: "/products?category=tech", color: "from-purple-500 to-blue-500", subcategories: productCategories.find(c => c.name === 'Tech & Gadgets')?.subcategories || [] },
  { name: "Local Favorites", icon: Star, href: "/products?category=local", color: "from-amber-500 to-orange-500", subcategories: productCategories.find(c => c.name === 'Local Favorites')?.subcategories || [] },
  { name: "All Categories", icon: ShoppingBag, href: "/products", color: "from-gray-600 to-gray-800", subcategories: [] }
];

export default function RetailerCategoryMenu() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Shop by Category</h3>
      <div className="space-y-3">
        {categories.map((category) => {
          const IconComponent = category.icon;
          return (
            <div key={category.name} className="group">
              <Link href={category.href}>
                <div className={`flex items-center p-3 rounded-lg bg-gradient-to-r ${category.color} text-white hover:shadow-lg transition-all duration-200 cursor-pointer group-hover:scale-102`}>
                  <IconComponent className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-sm">{category.name}</span>
                </div>
              </Link>
              
              {/* Subcategories */}
              {category.subcategories.length > 0 && (
                <div className="ml-4 mt-2 space-y-1">
                  {category.subcategories.map((sub) => (
                    <Link key={sub} href={`/products?category=${category.name.toLowerCase().replace(/\s+/g, '-')}&subcategory=${sub.toLowerCase().replace(/\s+/g, '-')}`}>
                      <div className="text-xs text-gray-600 hover:text-blue-600 py-1 px-2 rounded hover:bg-blue-50 transition-colors cursor-pointer">
                        • {sub}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}