import { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { ProductCategories } from "../components/ProductCategories";
import { FeaturedProducts, Product } from "../components/FeaturedProducts";
import { WhyChooseUs } from "../components/WhyChooseUs";
import { Contact } from "../components/Contact";
import { Footer } from "../components/Footer";
import { VehicleSelectionDialog } from "../components/VehicleSelectionDialog";
// Fix: Import VehicleFilter type, but removed unused VehicleSelector component import
import { VehicleFilter } from "../components/VehicleSelector";
import { supabase } from "../lib/supabase";
import { CartItem } from "../App";
import { toast } from "sonner";
import { Car, CheckCircle2 } from "lucide-react";
import { cn } from "../components/ui/utils";

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
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [vehicleFilter, setVehicleFilter] = useState<VehicleFilter | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(true);

    // Dialog State
    const [isGarageOpen, setIsGarageOpen] = useState(false);

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
                    let vQuery = supabase.from('vehicles').select('id');
                    vQuery = vQuery.eq('make', vehicleFilter.make);
                    if (vehicleFilter.model) vQuery = vQuery.eq('model', vehicleFilter.model);

                    const { data: vData } = await vQuery;
                    if (vData) {
                        targetVehicleIds = vData.map(v => v.id);
                    }
                }

                if (targetVehicleIds.length > 0) {
                    const { data: fitmentData, error: fitmentError } = await supabase
                        .from('product_fitment')
                        .select('product_id')
                        .in('vehicle_id', targetVehicleIds);

                    if (fitmentError) throw fitmentError;

                    if (fitmentData) {
                        validProductIds = Array.from(new Set(fitmentData.map(f => f.product_id)));
                        if (validProductIds.length === 0) {
                            setProducts([]);
                            setLoadingProducts(false);
                            return;
                        }
                    }
                } else {
                    setProducts([]);
                    setLoadingProducts(false);
                    return;
                }
            }

            let query = supabase.from('products').select('*');
            if (validProductIds !== null) query = query.in('id', validProductIds);
            if (selectedCategory) query = query.eq('category', selectedCategory);
            if (searchQuery) query = query.or(`name.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%,brand.ilike.%${searchQuery}%`);

            const { data, error } = await query;
            if (error) throw error;

            if (data) {
                const mappedProducts: Product[] = data.map((item: any) => ({
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
                }));
                setProducts(mappedProducts);
            }
        } catch (err) {
            console.error("Error:", err);
            toast.error("Error loading products");
        } finally {
            setLoadingProducts(false);
        }
    }

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const headerOffset = 180;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header
                cartItems={cartItems}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onRemoveItem={onRemoveItem}
                onUpdateQuantity={onUpdateQuantity}
                onCheckout={onCheckout}
            />
            <main>
                <Hero
                    onShopNow={() => scrollToSection('featured-products')}
                    onRequestQuote={() => scrollToSection('contact')}
                />

                {/* NEW: Sticky Garage Bar (Refined Design) */}
                <div className="sticky top-[72px] z-30 bg-white border-b border-gray-200 shadow-sm transition-all duration-300">
                    <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "p-2.5 rounded-full transition-colors",
                                vehicleFilter ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
                            )}>
                                {vehicleFilter ? <CheckCircle2 className="w-6 h-6" /> : <Car className="w-6 h-6" />}
                            </div>

                            <div className="flex flex-col">
                                <p className={cn(
                                    "text-xs font-bold uppercase tracking-wider mb-0.5 transition-colors",
                                    vehicleFilter ? "text-green-700" : "text-gray-500"
                                )}>
                                    {vehicleFilter ? "Fitting Parts For:" : "My Garage"}
                                </p>
                                <h3 className={cn(
                                    "font-bold leading-none transition-colors",
                                    vehicleFilter ? "text-gray-900 text-lg" : "text-gray-400 text-base"
                                )}>
                                    {vehicleFilter ? vehicleFilter.label : "No vehicle selected"}
                                </h3>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsGarageOpen(true)}
                            className="text-blue-600 font-semibold hover:text-blue-800 hover:bg-blue-50 px-4 py-2 rounded-lg transition-all text-sm"
                        >
                            {vehicleFilter ? "Change Vehicle" : "Add Vehicle"}
                        </button>
                    </div>
                </div>

                <div className="container mx-auto px-4 pt-8">
                    <ProductCategories
                        products={products}
                        selectedCategory={selectedCategory}
                        onSelectCategory={(cat) => { setSelectedCategory(cat); scrollToSection('featured-products'); }}
                    />
                </div>

                {loadingProducts ? (
                    <div className="text-center py-20 text-gray-500">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        Loading products...
                    </div>
                ) : (
                    <FeaturedProducts
                        products={products}
                        searchQuery={searchQuery}
                        selectedCategory={selectedCategory}
                        onAddToCart={(product) => onAddToCart(product)}
                    />
                )}

                <WhyChooseUs />
                <Contact />

                <VehicleSelectionDialog
                    open={isGarageOpen}
                    onOpenChange={setIsGarageOpen}
                    onVehicleSelect={setVehicleFilter}
                    selectedVehicleLabel={vehicleFilter?.label}
                />
            </main>
            <Footer />
        </div>
    );
}