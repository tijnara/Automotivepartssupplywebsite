import { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { HomeBanners } from "../components/HomeBanners";
import { ShopByParts, ShopByBrands } from "../components/ShopBySections";
import { LatestNews } from "../components/LatestNews";
import { FeaturedProducts, Product } from "../components/FeaturedProducts";
import { Footer } from "../components/Footer";
import { VehicleSelector, VehicleFilter } from "../components/VehicleSelector";
import { supabase } from "../lib/supabase";
import { CartItem } from "../App";
import { toast } from "sonner";

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
    // Removed unused 'setSelectedCategory' setter
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
        <div className="min-h-screen bg-white font-sans">
            <Header
                cartItems={cartItems}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onRemoveItem={onRemoveItem}
                onUpdateQuantity={onUpdateQuantity}
                onCheckout={onCheckout}
            />

            <main>
                {/* 1. Search Context / Vehicle Selector */}
                <div className="bg-gray-100 py-8 border-b border-gray-200">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-6">
                            <h2 className="text-xl md:text-2xl font-bold text-gray-800">What Are You Looking For?</h2>
                        </div>
                        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
                            <VehicleSelector onVehicleSelect={handleVehicleSelect} className="shadow-none border-0 mt-0" />
                        </div>
                    </div>
                </div>

                {/* 2. Banners */}
                <HomeBanners />

                {/* 3. Shop By Parts */}
                <ShopByParts />

                {/* 4. Featured Products */}
                {loadingProducts ? (
                    <div className="text-center py-20 text-gray-500">Loading...</div>
                ) : (
                    <FeaturedProducts
                        products={products}
                        searchQuery={searchQuery}
                        selectedCategory={selectedCategory}
                        onAddToCart={onAddToCart}
                    />
                )}

                {/* 5. Shop By Brands */}
                <ShopByBrands />

                {/* 6. Latest News */}
                <LatestNews />
            </main>

            <Footer />
        </div>
    );
}