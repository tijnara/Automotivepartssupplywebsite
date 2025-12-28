import { ShoppingCart, Star, Eye } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export interface Product {
    id: number;
    name: string;
    category: string;
    brand: string | null;
    price: number;
    originalPrice: number | null;
    rating: number | null;
    reviews: number | null;
    inStock: boolean;
    image: string;
}

interface FeaturedProductsProps {
    products: Product[];
    searchQuery: string; // Added to interface
    selectedCategory: string | null;
    onAddToCart: (product: any) => void;
}

export function FeaturedProducts({ products, searchQuery, selectedCategory, onAddToCart }: FeaturedProductsProps) {
    const ITEMS_PER_PAGE = 8;
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

    useEffect(() => {
        setVisibleCount(ITEMS_PER_PAGE);
    }, [searchQuery, selectedCategory]);

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (product.brand && product.brand.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesCategory = selectedCategory
            ? product.category === selectedCategory
            : true;

        return matchesSearch && matchesCategory;
    });

    const displayedProducts = filteredProducts.slice(0, visibleCount);

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
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {displayedProducts.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full"
                            >
                                <Link to={`/product/${product.id}`} className="block relative aspect-square bg-gray-100 overflow-hidden">
                                    <ImageWithFallback
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="bg-white text-gray-900 px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                            <Eye className="w-4 h-4" /> View Details
                                        </div>
                                    </div>

                                    {product.originalPrice && (
                                        <span className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold shadow-sm">
                                          SALE
                                        </span>
                                    )}
                                    {!product.inStock && (
                                        <span className="absolute top-3 left-3 bg-gray-900/80 text-white px-2 py-1 rounded text-[10px] font-bold shadow-sm uppercase tracking-wider">
                                          Out of Stock
                                        </span>
                                    )}
                                </Link>

                                <div className="p-4 flex flex-col flex-1">
                                    <div className="text-gray-500 mb-1 text-xs uppercase tracking-wider font-semibold">
                                        {product.brand && (
                                            <>
                                                <span className="text-blue-600">{product.brand}</span>
                                                <span className="mx-1.5 text-gray-300">•</span>
                                            </>
                                        )}
                                        {product.category}
                                    </div>

                                    <Link to={`/product/${product.id}`} className="mb-2">
                                        <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 h-12">
                                            {product.name}
                                        </h3>
                                    </Link>

                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="flex items-center text-yellow-400">
                                            <Star className="w-3.5 h-3.5 fill-current" />
                                            <span className="text-sm font-medium text-gray-700 ml-1">{product.rating}</span>
                                        </div>
                                        <span className="text-xs text-gray-400">({product.reviews} sold)</span>
                                    </div>

                                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
                                        <div className="flex flex-col">
                                            <span className="text-blue-700 font-bold text-lg">₱{product.price.toLocaleString()}</span>
                                            {product.originalPrice && (
                                                <span className="text-gray-400 text-xs line-through">
                                                    ₱{product.originalPrice.toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => onAddToCart(product)}
                                            disabled={!product.inStock}
                                            className={`p-2.5 rounded-full transition-colors active:scale-95 shadow-sm ${
                                                product.inStock
                                                    ? "bg-gray-100 hover:bg-blue-600 hover:text-white text-gray-700"
                                                    : "bg-gray-50 text-gray-300 cursor-not-allowed"
                                            }`}
                                            title={product.inStock ? "Add to Cart" : "Out of Stock"}
                                        >
                                            <ShoppingCart className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {filteredProducts.length > ITEMS_PER_PAGE && (
                    <div className="mt-12 text-center">
                        <button
                            onClick={() => setVisibleCount(prev => prev + ITEMS_PER_PAGE)}
                            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-8 py-3 rounded-full transition font-medium"
                        >
                            Show More Products
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}