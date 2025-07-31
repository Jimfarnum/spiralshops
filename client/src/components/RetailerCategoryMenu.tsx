import { Link } from "wouter";
import { ShoppingBag, Heart, Shirt, Home, Gamepad2, Dumbbell, Baby, Wrench, Book, Palette, PawPrint, Briefcase, Music, TreePine, UtensilsCrossed, Star, Zap } from "lucide-react";
import { productCategories } from "@/data/productCategories";

const categoryIcons: Record<string, any> = {
  'Fashion & Apparel': Shirt,
  'Beauty & Personal Care': Heart,
  'Home & Kitchen': Home,
  'Electronics': Gamepad2,
  'Sports & Outdoors': Dumbbell,
  'Health & Household': Heart,
  'Toys & Games': Zap,
  'Automotive': Wrench,
  'Tools & Hardware': Wrench,
  'Books & Media': Book,
  'Arts, Crafts & Sewing': Palette,
  'Pet Supplies': PawPrint,
  'Baby Products': Baby,
  'Office & School Supplies': Briefcase,
  'Musical Instruments': Music,
  'Patio, Lawn & Garden': TreePine,
  'Food & Beverages': UtensilsCrossed,
  'Local Favorites': Star
};

const categoryColors = [
  "from-pink-500 to-purple-500",
  "from-green-500 to-teal-500", 
  "from-blue-500 to-indigo-500",
  "from-purple-500 to-blue-500",
  "from-orange-500 to-red-500",
  "from-teal-500 to-green-500",
  "from-yellow-500 to-orange-500",
  "from-gray-600 to-gray-800",
  "from-amber-600 to-yellow-600",
  "from-indigo-500 to-purple-500",
  "from-rose-500 to-pink-500",
  "from-emerald-500 to-teal-500",
  "from-cyan-500 to-blue-500",
  "from-slate-600 to-gray-700",
  "from-violet-500 to-purple-500",
  "from-lime-500 to-green-500",
  "from-red-500 to-rose-500",
  "from-amber-500 to-orange-500"
];

const categories = productCategories.map((category, index) => ({
  name: category.name,
  icon: categoryIcons[category.name] || ShoppingBag,
  href: `/products?category=${category.name.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`,
  color: categoryColors[index % categoryColors.length],
  subcategories: category.subcategories
})).concat([
  { name: "All Categories", icon: ShoppingBag, href: "/products", color: "from-gray-600 to-gray-800", subcategories: [] }
]);

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