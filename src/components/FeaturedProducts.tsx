import { ShoppingCart, Star } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState, useEffect } from "react";

// Define the shape of a product
export interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    originalPrice: number | null;
    rating: number;
    reviews: number;
    inStock: boolean;
    image: string;
}

// Expanded product list
export const products: Product[] = [
    {
        id: 1,
        name: "Engine Oil Filter",
        category: "Engine Parts",
        price: 450,
        originalPrice: 550,
        rating: 4.8,
        reviews: 124,
        inStock: true,
        image: "https://images.unsplash.com/photo-1762139258224-236877b2c571?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBlbmdpbmUlMjBwYXJ0c3xlbnwxfHx8fDE3NjUxMDg4NTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
        id: 2,
        name: "Brake Disc Set",
        category: "Brake System",
        price: 3200,
        originalPrice: null,
        rating: 4.9,
        reviews: 89,
        inStock: true,
        image: "https://images.unsplash.com/photo-1762012507802-dbcc798c5480?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmFrZSUyMGRpc2MlMjBwYXJ0c3xlbnwxfHx8fDE3NjUxNDE5MzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
        id: 3,
        name: "Car Battery 12V",
        category: "Electrical",
        price: 4500,
        originalPrice: 5200,
        rating: 4.7,
        reviews: 156,
        inStock: true,
        image: "https://images.unsplash.com/photo-1597766325363-f5576d851d6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBiYXR0ZXJ5fGVufDF8fHx8MTc2NTEyNzI1OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
        id: 4,
        name: "Shock Absorber",
        category: "Suspension",
        price: 2800,
        originalPrice: null,
        rating: 4.6,
        reviews: 73,
        inStock: true,
        image: "https://images.unsplash.com/photo-1760836395763-25ea44ae8145?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBzdXNwZW5zaW9uJTIwcGFydHN8ZW58MXx8fHwxNzY1MTMwMDY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
        id: 5,
        name: "Spark Plug (Set of 4)",
        category: "Engine Parts", // Changed from Ignition to match existing categories
        price: 1200,
        originalPrice: 1500,
        rating: 4.9,
        reviews: 210,
        inStock: true,
        image: "https://images.unsplash.com/photo-1635784065679-b1d5d143c7b8?auto=format&fit=crop&q=80&w=1080"
    },
    {
        id: 6,
        name: "Air Filter",
        category: "Engine Parts", // Changed from Filters
        price: 850,
        originalPrice: null,
        rating: 4.5,
        reviews: 95,
        inStock: true,
        image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=1080"
    },
    {
        id: 7,
        name: "Synthetic Motor Oil 4L",
        category: "Engine Parts", // Changed from Fluids
        price: 2500,
        originalPrice: 2800,
        rating: 4.8,
        reviews: 342,
        inStock: true,
        image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=1080"
    },
    {
        id: 8,
        name: "Wiper Blades (Pair)",
        category: "Body Parts", // Changed from Accessories
        price: 450,
        originalPrice: null,
        rating: 4.3,
        reviews: 112,
        inStock: true,
        image: "https://images.unsplash.com/photo-1527383214149-c1639d48b7f7?auto=format&fit=crop&q=80&w=1080"
    },
    {
        id: 9,
        name: "Headlight Bulb LED",
        category: "Lighting",
        price: 1800,
        originalPrice: 2200,
        rating: 4.7,
        reviews: 180,
        inStock: true,
        image: "https://images.unsplash.com/photo-1552975661-26dd7f722026?auto=format&fit=crop&q=80&w=1080"
    },
    {
        id: 10,
        name: "Brake Pads (Front)",
        category: "Brake System",
        price: 1500,
        originalPrice: null,
        rating: 4.8,
        reviews: 145,
        inStock: true,
        image: "https://images.unsplash.com/photo-1502446700084-5f653457a409?auto=format&fit=crop&q=80&w=1080"
    },
    {
        id: 11,
        name: "Timing Belt",
        category: "Engine Parts",
        price: 2200,
        originalPrice: 2500,
        rating: 4.6,
        reviews: 88,
        inStock: true,
        image: "https://images.unsplash.com/photo-1587355157147-3f9b2d2f7f9e?auto=format&fit=crop&q=80&w=1080"
    },
    {
        id: 12,
        name: "Radiator Coolant",
        category: "Engine Parts",
        price: 350,
        originalPrice: null,
        rating: 4.9,
        reviews: 320,
        inStock: true,
        image: "https://images.unsplash.com/photo-1626244465228-5690b6c6b4e4?auto=format&fit=crop&q=80&w=1080"
    }
];

interface FeaturedProductsProps {
    searchQuery: string;
    selectedCategory: string | null;
    onAddToCart: (product: Product) => void;
}

export function FeaturedProducts({ searchQuery, selectedCategory, onAddToCart }: FeaturedProductsProps) {
    // Initial visible count
    const ITEMS_PER_PAGE = 4;
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

    // Reset pagination when search query or category changes
    useEffect(() => {
        setVisibleCount(ITEMS_PER_PAGE);
    }, [searchQuery, selectedCategory]);

    // 1. Filter by search query AND category
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = selectedCategory
            ? product.category === selectedCategory
            : true;

        return matchesSearch && matchesCategory;
    });

    // 2. Slice for "Load More"
    const displayedProducts = filteredProducts.slice(0, visibleCount);

    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
    };

    const handleShowLess = () => {
        setVisibleCount(ITEMS_PER_PAGE);
    };

    return (
        <section id="featured-products" className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h2 className="mb-2">
                            {selectedCategory ? `${selectedCategory}` : "Featured Products"}
                        </h2>
                        <p className="text-gray-600">
                            {filteredProducts.length} items found
                        </p>
                    </div>
                </div>

                {displayedProducts.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
                        <p className="text-lg">No products found</p>
                        {selectedCategory && (
                            <p className="text-sm mt-2">Try selecting a different category or clearing your search.</p>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {displayedProducts.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition group flex flex-col"
                            >
                                <div className="relative aspect-square bg-gray-100">
                                    <ImageWithFallback
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                    {product.originalPrice && (
                                        <span className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded shadow-sm text-sm font-medium">
                                          Sale
                                        </span>
                                    )}
                                    {product.inStock && (
                                        <span className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded shadow-sm text-sm font-medium">
                                          In Stock
                                        </span>
                                    )}
                                </div>
                                <div className="p-4 flex flex-col flex-1">
                                    <div className="text-gray-500 mb-2 text-sm">{product.category}</div>
                                    <h3 className="mb-2 font-semibold text-lg leading-tight">{product.name}</h3>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded">
                                            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                            <span className="text-sm font-medium text-yellow-700">{product.rating}</span>
                                        </div>
                                        <span className="text-xs text-gray-400">({product.reviews} reviews)</span>
                                    </div>
                                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
                                        <div>
                                            <div className="text-blue-700 font-bold text-lg">₱{product.price.toLocaleString()}</div>
                                            {product.originalPrice && (
                                                <div className="text-gray-400 text-xs line-through">
                                                    ₱{product.originalPrice.toLocaleString()}
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => onAddToCart(product)}
                                            className="bg-blue-600 text-white p-2.5 rounded-full hover:bg-blue-700 transition active:scale-95 shadow-sm hover:shadow"
                                            title="Add to Cart"
                                        >
                                            <ShoppingCart className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Bottom Action Buttons */}
                {filteredProducts.length > ITEMS_PER_PAGE && (
                    <div className="mt-12 text-center flex justify-center gap-4">
                        {visibleCount < filteredProducts.length && (
                            <button
                                onClick={handleLoadMore}
                                className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition shadow-sm font-medium"
                            >
                                Load More Products
                            </button>
                        )}

                        {visibleCount > ITEMS_PER_PAGE && (
                            <button
                                onClick={handleShowLess}
                                className="bg-white border border-gray-300 text-gray-700 px-8 py-3 rounded-full hover:bg-gray-50 transition shadow-sm font-medium"
                            >
                                Show Less
                            </button>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}