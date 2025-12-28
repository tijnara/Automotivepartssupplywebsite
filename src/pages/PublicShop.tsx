import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { ProductCategories } from "../components/ProductCategories";
import { FeaturedProducts, Product } from "../components/FeaturedProducts";
import { WhyChooseUs } from "../components/WhyChooseUs";
import { Contact } from "../components/Contact";
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
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    // Updated state to hold the filter object instead of just ID
    const [vehicleFilter, setVehicleFilter] = useState<VehicleFilter | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const location = useLocation();

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
                    // Exact vehicle identified
                    targetVehicleIds = [vehicleFilter.vehicleId];
                } else if (vehicleFilter.make) {
                    // Broad search (e.g. "Toyota" or "Toyota Vios" without year)
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
                        // Use Set to remove duplicates if multiple vehicle IDs map to same product
                        validProductIds = Array.from(new Set(fitmentData.map(f => f.product_id)));

                        if (validProductIds.length === 0) {
                            setProducts([]);
                            setLoadingProducts(false);
                            // Optional: Warn user nothing found for this car
                            return;
                        }
                    }
                } else {
                    // Filter active but no vehicles found in DB matching criteria
                    setProducts([]);
                    setLoadingProducts(false);
                    return;
                }
            }

            let query = supabase.from('products').select('*');

            if (validProductIds !== null) {
                query = query.in('id', validProductIds);
            }

            if (selectedCategory) {
                query = query.eq('category', selectedCategory);
            }

            if (searchQuery) {
                query = query.or(`name.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%,brand.ilike.%${searchQuery}%`);
            }

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

                if (vehicleFilter && mappedProducts.length > 0) {
                    // Only show toast once or sparingly to avoid spamming
                    // toast.success(`Found ${mappedProducts.length} parts for ${vehicleFilter.label}`);
                }
            }
        } catch (err) {
            console.error("Error fetching products:", err);
            toast.error("Error loading products");
        } finally {
            setLoadingProducts(false);
        }
    }

    useEffect(() => {
        if (location.hash) {
            const id = location.hash.replace('#', '');
            setTimeout(() => {
                scrollToSection(id);
            }, 500);
        }
    }, [location]);

    const handleSelectCategory = (category: string | null) => {
        setSelectedCategory(category);
        scrollToSection('featured-products');
    };

    const handleVehicleSelect = (filter: VehicleFilter | null) => {
        setVehicleFilter(filter);
        scrollToSection('featured-products');
        if (filter) {
            toast.success(`Filtering products for ${filter.label}`);
        } else {
            toast.info("Showing all vehicles parts");
        }
    };

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const headerOffset = 180;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    };

    return (
        <div className="min-h-screen">
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

                <div className="container mx-auto px-4 relative z-20">
                    <VehicleSelector onVehicleSelect={handleVehicleSelect} />
                </div>

                <ProductCategories
                    products={products}
                    selectedCategory={selectedCategory}
                    onSelectCategory={handleSelectCategory}
                />

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
                        onAddToCart={onAddToCart}
                    />
                )}

                <WhyChooseUs />
                <Contact />
            </main>
            <Footer />
        </div>
    );
}