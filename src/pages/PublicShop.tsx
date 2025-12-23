import { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { ProductCategories } from "../components/ProductCategories";
import { FeaturedProducts } from "../components/FeaturedProducts";
import { WhyChooseUs } from "../components/WhyChooseUs";
import { Contact } from "../components/Contact";
import { Footer } from "../components/Footer";
import { supabase } from "../lib/supabase";
import { CartItem } from "../App";

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
    const [products, setProducts] = useState<any[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(true);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const { data, error } = await supabase.from('products').select('*');
                if (error) throw error;

                if (data) {
                    const mappedProducts = data.map((item: any) => ({
                        id: item.id,
                        name: item.name,
                        category: item.category,
                        price: Number(item.price),
                        originalPrice: item.original_price ? Number(item.original_price) : null,
                        rating: Number(item.rating),
                        reviews: item.reviews,
                        inStock: item.in_stock,
                        image: item.image
                    }));
                    setProducts(mappedProducts);
                }
            } catch (err) {
                console.error("Error fetching products:", err);
            } finally {
                setLoadingProducts(false);
            }
        }

        fetchProducts();
    }, []);

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
                <ProductCategories
                    products={products}
                    selectedCategory={selectedCategory}
                    onSelectCategory={handleSelectCategory}
                />
                {loadingProducts ? (
                    <div className="text-center py-20 text-gray-500">Loading products from database...</div>
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