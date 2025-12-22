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

interface FeaturedProductsProps {
    products: Product[]; // UPDATED: Accepts products from parent
    searchQuery: string;
    selectedCategory: string | null;
    onAddToCart: (product: Product) => void;
}

export function FeaturedProducts({ products, searchQuery, selectedCategory, onAddToCart }: FeaturedProductsProps) {
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