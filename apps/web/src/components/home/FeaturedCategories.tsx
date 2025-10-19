import Link from "next/link";
import { 
  Smartphone, 
  Shirt, 
  Home, 
  Dumbbell, 
  Book, 
  Sparkles,
  Laptop,
  Watch
} from "lucide-react";

const categories = [
  {
    id: 1,
    name: "Electronics",
    icon: Smartphone,
    count: "10,000+ items",
    color: "bg-blue-500",
    link: "/categories/electronics",
  },
  {
    id: 2,
    name: "Fashion",
    icon: Shirt,
    count: "25,000+ items",
    color: "bg-pink-500",
    link: "/categories/fashion",
  },
  {
    id: 3,
    name: "Home & Garden",
    icon: Home,
    count: "15,000+ items",
    color: "bg-green-500",
    link: "/categories/home-garden",
  },
  {
    id: 4,
    name: "Sports",
    icon: Dumbbell,
    count: "8,000+ items",
    color: "bg-orange-500",
    link: "/categories/sports",
  },
  {
    id: 5,
    name: "Books",
    icon: Book,
    count: "50,000+ items",
    color: "bg-purple-500",
    link: "/categories/books",
  },
  {
    id: 6,
    name: "Beauty",
    icon: Sparkles,
    count: "12,000+ items",
    color: "bg-red-500",
    link: "/categories/beauty",
  },
  {
    id: 7,
    name: "Computers",
    icon: Laptop,
    count: "5,000+ items",
    color: "bg-indigo-500",
    link: "/categories/computers",
  },
  {
    id: 8,
    name: "Watches",
    icon: Watch,
    count: "3,000+ items",
    color: "bg-yellow-500",
    link: "/categories/watches",
  },
];

export function FeaturedCategories() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
      {categories.map((category) => {
        const IconComponent = category.icon;
        return (
          <Link
            key={category.id}
            href={category.link}
            className="group flex flex-col items-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
          >
            <div className={`${category.color} p-4 rounded-full mb-4 group-hover:scale-110 transition-transform duration-200`}>
              <IconComponent className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 text-center mb-2">
              {category.name}
            </h3>
            <p className="text-sm text-gray-500 text-center">
              {category.count}
            </p>
          </Link>
        );
      })}
    </div>
  );
}