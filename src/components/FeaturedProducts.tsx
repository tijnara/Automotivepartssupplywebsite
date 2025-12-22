import { ShoppingCart, Star } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const products = [
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
];

interface FeaturedProductsProps {
    searchQuery: string;
    onAddToCart: (name: string) => void;
}

export function FeaturedProducts({ searchQuery, onAddToCart }: FeaturedProductsProps) {
    // Filter products based on search query
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <section id="products" className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h2 className="mb-2">Featured Products</h2>
                        <p className="text-gray-600">
                            {filteredProducts.length} items found
                        </p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700">
                        View All →
                    </button>
                </div>

                {filteredProducts.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        No products found matching "{searchQuery}"
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
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
                                        <span className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded">
                      Sale
                    </span>
                                    )}
                                    {product.inStock && (
                                        <span className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded">
                      In Stock
                    </span>
                                    )}
                                </div>
                                <div className="p-4 flex flex-col flex-1">
                                    <div className="text-gray-500 mb-2">{product.category}</div>
                                    <h3 className="mb-2">{product.name}</h3>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            <span>{product.rating}</span>
                                        </div>
                                        <span className="text-gray-400">({product.reviews})</span>
                                    </div>
                                    <div className="flex items-center justify-between mt-auto">
                                        <div>
                                            <div className="text-blue-600">₱{product.price.toLocaleString()}</div>
                                            {product.originalPrice && (
                                                <div className="text-gray-400 line-through">
                                                    ₱{product.originalPrice.toLocaleString()}
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => onAddToCart(product.name)}
                                            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition active:scale-95"
                                        >
                                            <ShoppingCart className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}