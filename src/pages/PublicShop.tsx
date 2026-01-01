import { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { HomeBanners } from "../components/HomeBanners";
import { ShopByParts, ShopByBrands } from "../components/ShopBySections";
import { LatestNews } from "../components/LatestNews";
import { FeaturedProducts, Product } from "../components/FeaturedProducts";
import { Footer } from "../components/Footer";
import { VehicleSelector, VehicleFilter } from "../components/VehicleSelector";
import { supabase } from "../lib/supabase";
import { CartItem } from "../App";
import { toast } from "sonner";
import { Search } from "lucide-react";

interface PublicShopProps {
    cartItems: CartItem[];
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    onRemoveItem: (id: number) => void;
    onUpdateQuantity: (id: number, delta: number) => void;
    onCheckout: () => void;
    onAddToCart: (product: any) => void;
}

export default function PublicShop({
                                       cartItems,
                                       searchQuery,
                                       setSearchQuery,
                                       onRemoveItem,
                                       onUpdateQuantity,
                                       onCheckout,
                                       onAddToCart
                                   }: PublicShopProps) {
    const [selectedCategory] = useState<string | null>(null);
    const [vehicleFilter, setVehicleFilter] = useState<VehicleFilter | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, [selectedCategory, searchQuery, vehicleFilter]);

    async function fetchProducts() {
        setLoadingProducts(true);
        try {
            let validProductIds: number[] | null = null;

            if (vehicleFilter) {
                let targetVehicleIds: number[] = [];
                if (vehicleFilter.vehicleId) {
                    targetVehicleIds = [vehicleFilter.vehicleId];
                } else if (vehicleFilter.make) {
                    let vQuery = supabase.from('vehicles').select('id').eq('make', vehicleFilter.make);
                    if (vehicleFilter.model) vQuery = vQuery.eq('model', vehicleFilter.model);
                    const { data: vData } = await vQuery;
                    if (vData) targetVehicleIds = vData.map(v => v.id);
                }

                if (targetVehicleIds.length > 0) {
                    const { data: fitmentData } = await supabase.from('product_fitment').select('product_id').in('vehicle_id', targetVehicleIds);
                    if (fitmentData) validProductIds = Array.from(new Set(fitmentData.map(f => f.product_id)));
                    else validProductIds = [];
                } else {
                    validProductIds = [];
                }
            }

            let query = supabase.from('products').select('*');
            if (validProductIds !== null) query = query.in('id', validProductIds);
            if (selectedCategory) query = query.eq('category', selectedCategory);
            if (searchQuery) query = query.or(`name.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%,brand.ilike.%${searchQuery}%`);

            const { data, error } = await query;
            if (error) throw error;

            if (data) {
                setProducts(data.map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    category: item.category,
                    brand: item.brand,
                    price: Number(item.price),
                    originalPrice: item.original_price ? Number(item.original_price) : null,
                    rating: Number(item.rating),
                    reviews: item.reviews,
                    inStock: item.in_stock && (item.quantity || 0) > 0,
                    image: item.image
                })));
            }
        } catch (err) {
            console.error(err);
            toast.error("Error loading products");
        } finally {
            setLoadingProducts(false);
        }
    }

    const handleVehicleSelect = (filter: VehicleFilter | null) => {
        setVehicleFilter(filter);
        if (filter) {
            toast.success(`Filtering products for ${filter.label}`);
            const element = document.getElementById('featured-products');
            if(element) element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            <Header
                cartItems={cartItems}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onRemoveItem={onRemoveItem}
                onUpdateQuantity={onUpdateQuantity}
                onCheckout={onCheckout}
            />

            <main>
                {/* 1. Hero Banner */}
                <Hero
                    onShopNow={() => document.getElementById('featured-products')?.scrollIntoView({behavior: 'smooth'})}
                    onRequestQuote={() => document.getElementById('contact')?.scrollIntoView({behavior: 'smooth'})}
                />

                {/* 2. "What Are You Looking For?" Search Context */}
                <div className="bg-gray-50 py-10 border-b border-gray-200">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">What Are You Looking For?</h2>
                            <p className="text-gray-500 mt-2">Search our extensive catalog of parts for your specific vehicle</p>
                        </div>

                        {/* Integrated Vehicle Selector styled to look more like the search box in video */}
                        <div className="max-w-5xl mx-auto bg-white p-1 rounded-xl shadow-lg border border-gray-200">
                            <VehicleSelector onVehicleSelect={handleVehicleSelect} className="shadow-none border-0 m-0" />
                        </div>

                        {/* Fallback search if they prefer generic search */}
                        <div className="max-w-2xl mx-auto mt-6 relative md:hidden">
                            <input
                                type="text"
                                placeholder="Or search by keyword..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                            />
                            <button className="absolute right-2 top-2 p-1 bg-blue-600 text-white rounded-md">
                                <Search className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* 3. Home Banners (Parts & Acc / Perf & Tools) */}
                <HomeBanners />

                {/* 4. Shop By Parts Grid */}
                <ShopByParts />

                {/* 5. Featured Products (Dynamic Content) */}
                <div id="featured-products">
                    {loadingProducts ? (
                        <div className="text-center py-20 text-gray-500 bg-gray-50">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p>Loading catalog...</p>
                        </div>
                    ) : (
                        <FeaturedProducts
                            products={products}
                            searchQuery={searchQuery}
                            selectedCategory={selectedCategory} // Always null initially but kept for interface
                            onAddToCart={onAddToCart}
                        />
                    )}
                </div>

                {/* 6. Shop By Brands Grid */}
                <ShopByBrands />

                {/* 7. Latest News */}
                <LatestNews />
            </main>

            <Footer />
        </div>
    );
}