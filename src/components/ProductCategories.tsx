import {
    Car,
    Cog,
    Battery,
    CircleDot,
    Gauge,
    Lightbulb,
    Wind,
    Wrench
} from "lucide-react";
import { cn } from "./ui/utils";
import { products } from "./FeaturedProducts";

// Removed hardcoded counts, kept static definition of icon + name
const categoryDefinitions = [
    { icon: Cog, name: "Engine Parts" },
    { icon: CircleDot, name: "Brake System" },
    { icon: Battery, name: "Electrical" },
    { icon: Wind, name: "Suspension" },
    { icon: Gauge, name: "Transmission" },
    { icon: Lightbulb, name: "Lighting" },
    { icon: Wrench, name: "Tools" },
    { icon: Car, name: "Body Parts" },
];

interface ProductCategoriesProps {
    selectedCategory: string | null;
    onSelectCategory: (category: string | null) => void;
}

export function ProductCategories({ selectedCategory, onSelectCategory }: ProductCategoriesProps) {
    return (
        <section id="products" className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="mb-4">Browse by Category</h2>
                    <p className="text-gray-600">
                        Find the right parts for your vehicle from our extensive inventory
                    </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {categoryDefinitions.map((category) => {
                        const Icon = category.icon;
                        const isSelected = selectedCategory === category.name;

                        // Calculate real count from the products array
                        const count = products.filter(p => p.category === category.name).length;

                        return (
                            <button
                                key={category.name}
                                onClick={() => onSelectCategory(isSelected ? null : category.name)}
                                className={cn(
                                    "p-6 rounded-lg shadow-sm transition text-center group border-2",
                                    isSelected
                                        ? "bg-blue-50 border-blue-600 shadow-md"
                                        : "bg-white border-transparent hover:border-blue-100 hover:shadow-md"
                                )}
                            >
                                <div className={cn(
                                    "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition",
                                    isSelected
                                        ? "bg-blue-600 text-white"
                                        : "bg-blue-100 group-hover:bg-blue-600"
                                )}>
                                    <Icon className={cn(
                                        "w-8 h-8 transition",
                                        isSelected
                                            ? "text-white"
                                            : "text-blue-600 group-hover:text-white"
                                    )} />
                                </div>
                                <h3 className={cn("mb-2 font-semibold", isSelected ? "text-blue-900" : "text-gray-900")}>
                                    {category.name}
                                </h3>
                                <p className={cn("text-sm", isSelected ? "text-blue-700" : "text-gray-600")}>
                                    {count} {count === 1 ? 'item' : 'items'}
                                </p>
                            </button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}