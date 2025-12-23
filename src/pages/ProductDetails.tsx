import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { supabase } from "../lib/supabase";
import { Star, Truck, ShieldCheck, Minus, Plus, ShoppingCart, Heart } from "lucide-react";
import { CartItem } from "../App";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

interface ProductDetailsProps {
    cartItems: CartItem[];
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    onRemoveItem: (id: number) => void;
    onUpdateQuantity: (id: number, delta: number) => void;
    onCheckout: () => void;
    onAddToCart: (product: any, qty: number) => void;
}

export default function ProductDetails({
                                           cartItems,
                                           searchQuery,
                                           setSearchQuery,
                                           onRemoveItem,
                                           onUpdateQuantity,
                                           onCheckout,
                                           onAddToCart
                                       }: ProductDetailsProps) {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        window.scrollTo(0, 0);
        async function fetchProduct() {
            if (!id || isNaN(parseInt(id))) return;
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('id', parseInt(id))
                    .single();

                if (error) throw error;
                setProduct(data);
            } catch (err) {
                console.error("Error fetching product:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchProduct();
    }, [id]);

    const handleQuantityChange = (delta: number) => {
        setQuantity(prev => Math.max(1, prev + delta));
    };

    const handleBuyNow = () => {
        if (product) {
            onAddToCart(product, quantity);
            // Open cart logic usually handled by Header, but we can't trigger it easily here
            // without context. For now, just add to cart.
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <h2 className="text-2xl font-bold">Product not found</h2>
                <Button onClick={() => navigate("/")}>Back to Shop</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header
                cartItems={cartItems}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onRemoveItem={onRemoveItem}
                onUpdateQuantity={onUpdateQuantity}
                onCheckout={onCheckout}
            />

            <main className="flex-grow container mx-auto px-4 py-8">
                {/* Breadcrumbs */}
                <div className="flex items-center text-sm text-gray-500 mb-6">
                    <Link to="/" className="hover:text-blue-600">Home</Link>
                    <span className="mx-2">/</span>
                    <span className="capitalize">{product.category}</span>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</span>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="grid md:grid-cols-2 gap-0 md:gap-8">
                        {/* Product Image Section */}
                        <div className="p-6 md:p-10 bg-white flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-100">
                            <div className="relative w-full max-w-[500px] aspect-square">
                                <ImageWithFallback
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                                />
                                {product.in_stock ? (
                                    <span className="absolute top-0 left-0 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                        In Stock
                                    </span>
                                ) : (
                                    <span className="absolute top-0 left-0 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                        Out of Stock
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Product Info Section */}
                        <div className="p-6 md:p-10 flex flex-col">
                            <div className="mb-1">
                                <span className="text-blue-600 font-medium text-sm uppercase tracking-wide">
                                    {product.category}
                                </span>
                            </div>
                            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2 leading-tight">
                                {product.name}
                            </h1>

                            {/* Ratings */}
                            <div className="flex items-center gap-2 mb-6">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-4 h-4 ${i < (product.rating || 0) ? 'fill-current' : 'text-gray-300'}`} />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-500">({product.reviews || 0} reviews)</span>
                            </div>

                            {/* Price */}
                            <div className="mb-8">
                                <div className="flex items-baseline gap-3">
                                    <span className="text-3xl md:text-4xl font-bold text-blue-700">
                                        ₱{Number(product.price).toLocaleString()}
                                    </span>
                                    {product.original_price && (
                                        <span className="text-lg text-gray-400 line-through">
                                            ₱{Number(product.original_price).toLocaleString()}
                                        </span>
                                    )}
                                </div>
                                {product.original_price && (
                                    <p className="text-sm text-green-600 font-medium mt-1">
                                        You save ₱{(product.original_price - product.price).toLocaleString()}
                                    </p>
                                )}
                            </div>

                            <Separator className="mb-8" />

                            {/* Quantity & Actions */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <span className="font-medium text-gray-700">Quantity:</span>
                                    <div className="flex items-center border border-gray-300 rounded-lg">
                                        <button
                                            onClick={() => handleQuantityChange(-1)}
                                            className="p-3 hover:bg-gray-100 transition disabled:opacity-50"
                                            disabled={quantity <= 1}
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="w-12 text-center font-medium">{quantity}</span>
                                        <button
                                            onClick={() => handleQuantityChange(1)}
                                            className="p-3 hover:bg-gray-100 transition"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Button
                                        className="flex-1 h-12 text-lg bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20"
                                        onClick={handleBuyNow}
                                        disabled={!product.in_stock}
                                    >
                                        <ShoppingCart className="w-5 h-5 mr-2" />
                                        Add to Cart
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="h-12 w-full sm:w-12 px-0 border-gray-300"
                                        title="Add to Wishlist"
                                    >
                                        <Heart className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-gray-100">
                                <div className="flex items-start gap-3">
                                    <Truck className="w-6 h-6 text-blue-600 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-medium text-sm text-gray-900">Fast Delivery</h4>
                                        <p className="text-xs text-gray-500">Nationwide shipping available</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <ShieldCheck className="w-6 h-6 text-blue-600 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-medium text-sm text-gray-900">Genuine Parts</h4>
                                        <p className="text-xs text-gray-500">100% Authentic products</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Info Tabs */}
                    <div className="border-t border-gray-200 bg-gray-50/50 p-6 md:p-10">
                        <Tabs defaultValue="description" className="w-full">
                            <TabsList className="mb-6">
                                <TabsTrigger value="description">Description</TabsTrigger>
                                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                            </TabsList>
                            <TabsContent value="description" className="text-gray-600 leading-relaxed">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Description</h3>
                                <p className="mb-4">
                                    Upgrade your vehicle with the {product.name}. Designed for durability and performance,
                                    this {product.category.toLowerCase()} part meets strict quality standards to ensure reliability on the road.
                                </p>
                                <p>
                                    Whether you are performing routine maintenance or a major repair, {product.name} offers the perfect fit
                                    and function. Sourced from trusted manufacturers, it provides peace of mind and excellent value.
                                </p>
                            </TabsContent>
                            <TabsContent value="specifications">
                                <div className="border rounded-lg overflow-hidden">
                                    <table className="w-full text-sm text-left">
                                        <tbody className="divide-y divide-gray-100 bg-white">
                                        <tr>
                                            <td className="p-4 font-medium text-gray-900 bg-gray-50 w-1/3">Category</td>
                                            <td className="p-4 text-gray-600">{product.category}</td>
                                        </tr>
                                        <tr>
                                            <td className="p-4 font-medium text-gray-900 bg-gray-50">Stock Status</td>
                                            <td className="p-4 text-gray-600">{product.in_stock ? "Available" : "Out of Stock"}</td>
                                        </tr>
                                        <tr>
                                            <td className="p-4 font-medium text-gray-900 bg-gray-50">Part Name</td>
                                            <td className="p-4 text-gray-600">{product.name}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </TabsContent>
                            <TabsContent value="reviews">
                                <div className="text-center py-10 text-gray-500">
                                    <Star className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                    <p>No written reviews yet for this product.</p>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}