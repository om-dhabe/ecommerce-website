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
    hoverColor: "group-hover:bg-blue-600",
    link: "/categories/electronics",
  },
  {
    id: 2,
    name: "Fashion",
    icon: Shirt,
    count: "25,000+ items",
    color: "bg-pink-500",
    hoverColor: "group-hover:bg-pink-600",
    link: "/categories/fashion",
  },
  {
    id: 3,
    name: "Home & Garden",
    icon: Home,
    count: "15,000+ items",
    color: "bg-green-500",
    hoverColor: "group-hover:bg-green-600",
    link: "/categories/home-garden",
  },
  {
    id: 4,
    name: "Sports",
    icon: Dumbbell,
    count: "8,000+ items",
    color: "bg-orange-500",
    hoverColor: "group-hover:bg-orange-600",
    link: "/categories/sports",
  },
  {
    id: 5,
    name: "Books",
    icon: Book,
    count: "50,000+ items",
    color: "bg-purple-500",
    hoverColor: "group-hover:bg-purple-600",
    link: "/categories/books",
  },
  {
    id: 6,
    name: "Beauty",
    icon: Sparkles,
    count: "12,000+ items",
    color: "bg-red-500",
    hoverColor: "group-hover:bg-red-600",
    link: "/categories/beauty",
  },
  {
    id: 7,
    name: "Computers",
    icon: Laptop,
    count: "5,000+ items",
    color: "bg-indigo-500",
    hoverColor: "group-hover:bg-indigo-600",
    link: "/categories/computers",
  },
  {
    id: 8,
    name: "Watches",
    icon: Watch,
    count: "3,000+ items",
    color: "bg-yellow-500",
    hoverColor: "group-hover:bg-yellow-600",
    link: "/categories/watches",
  },
];

export function FeaturedCategories() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 sm:gap-4 lg:gap-6">
      {categories.map((category, index) => {
        const IconComponent = category.icon;
        return (
          <Link
            key={category.id}
            href={category.link}
            className="group flex flex-col items-center p-3 sm:p-4 lg:p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 card stagger-item focus-ring"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={`${category.color} ${category.hoverColor} p-3 sm:p-4 rounded-full mb-3 sm:mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
              <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 text-center mb-1 sm:mb-2 text-sm sm:text-base lg:text-lg leading-tight">
              {category.name}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 text-center leading-tight">
              {category.count}
            </p>
            
            {/* Hover effect indicator */}
            <div className="w-0 group-hover:w-8 h-0.5 bg-blue-500 transition-all duration-300 mt-2 rounded-full"></div>
          </Link>
        );
      })}
    </div>
  );
}