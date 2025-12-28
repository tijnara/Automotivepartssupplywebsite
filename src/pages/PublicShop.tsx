import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { ProductCategories } from "../components/ProductCategories";
import { FeaturedProducts, Product } from "../components/FeaturedProducts";
import { WhyChooseUs } from "../components/WhyChooseUs";
import { Contact } from "../components/Contact";
import { Footer } from "../components/Footer";
import { VehicleSelector, Vehicle } from "../components/VehicleSelector";
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
    onAddToCart: (product: any, qty?: number, vehicle?: Vehicle) => void; // Updated signature
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
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null); // Store full object
    const [products, setProducts] = useState<Product[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(true);

    const location = useLocation();

    useEffect(() => {
        fetchProducts();
    }, [selectedCategory, searchQuery, selectedVehicle]);

    async function fetchProducts() {
        setLoadingProducts(true);
        try {
            let validProductIds: number[] | null = null;

            if (selectedVehicle) {
                const { data: fitmentData, error: fitmentError } = await supabase
                    .from('product_fitment')
                    .select('product_id')
                    .eq('vehicle_id', selectedVehicle.id)
                    .returns<{ product_id: number }[]>();

                if (fitmentError) throw fitmentError;

                if (fitmentData) {
                    validProductIds = fitmentData.map(f => f.product_id);

                    if (validProductIds.length === 0) {
                        setProducts([]);
                        setLoadingProducts(false);
                        return;
                    }
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

                if (selectedVehicle && mappedProducts.length > 0) {
                    toast.success(`Found ${mappedProducts.length} parts for your ${selectedVehicle.make} ${selectedVehicle.model}`);
                }
            }
        } catch (err) {
            console.error("Error fetching products:", err);
            toast.error("Error loading products");
        } finally {
            setLoadingProducts(false);
        }
    }

    // Handle initial hash scrolling
    useEffect(() => {
        if (location.hash) {
            const id = location.hash.replace('#', '');
            setTimeout(() => {
                scrollToSection(id);
            }, 500);
        }
    }, [location]);

    // Simplified Add to Cart - no modal, just add with vehicle context
    const handleAddToCartClick = (product: any) => {
        if (selectedVehicle) {
            onAddToCart(product, 1, selectedVehicle);
        } else {
            // Add without vehicle info if none selected
            onAddToCart(product, 1);
        }
    };

    const handleSelectCategory = (category: string | null) => {
        setSelectedCategory(category);
        scrollToSection('featured-products');
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
                    <VehicleSelector
                        onVehicleSelect={setSelectedVehicle}
                        className="-mt-10 mx-4 md:mx-auto max-w-5xl shadow-lg border border-gray-100"
                    />
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
                        onAddToCart={handleAddToCartClick}
                    />
                )}

                <WhyChooseUs />
                <Contact />
            </main>
            <Footer />
        </div>
    );
}