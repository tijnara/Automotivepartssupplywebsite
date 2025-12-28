import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
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
    // All products lightweight fetch for category counts
    const [allCategories, setAllCategories] = useState<{id: number, category: string}[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(true);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const ITEMS_PER_PAGE = 8;

    const location = useLocation();

    // Initial load for category counts
    useEffect(() => {
        async function fetchCategoryCounts() {
            const { data } = await supabase.from('products').select('id, category');
            if (data) setAllCategories(data);
        }
        fetchCategoryCounts();
    }, []);

    // Main Product Fetch with Pagination
    useEffect(() => {
        async function fetchProducts() {
            setLoadingProducts(true);
            try {
                let query = supabase.from('products').select('*', { count: 'exact' });

                // Apply Filters
                if (selectedCategory) {
                    query = query.eq('category', selectedCategory);
                }

                if (searchQuery) {
                    query = query.or(`name.ilike.%${searchQuery}%,brand.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`);
                }

                // Apply Pagination
                const from = (currentPage - 1) * ITEMS_PER_PAGE;
                const to = from + ITEMS_PER_PAGE - 1;

                const { data, error, count } = await query
                    .order('in_stock', { ascending: false }) // Show in-stock first
                    .range(from, to);

                if (error) throw error;

                if (data) {
                    const mappedProducts = data.map((item: any) => ({
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
                    setTotalProducts(count || 0);
                }
            } catch (err) {
                console.error("Error fetching products:", err);
            } finally {
                setLoadingProducts(false);
            }
        }

        // Debounce if there is a search query
        const timer = setTimeout(() => {
            fetchProducts();
        }, searchQuery ? 500 : 0);

        return () => clearTimeout(timer);
    }, [currentPage, searchQuery, selectedCategory]);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedCategory]);

    // Handle Anchor Links
    useEffect(() => {
        if (location.hash) {
            const id = location.hash.replace('#', '');
            setTimeout(() => {
                scrollToSection(id);
            }, 100);
        }
    }, [location]);

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
                    products={allCategories} // Pass all lightweight data for counts
                    selectedCategory={selectedCategory}
                    onSelectCategory={handleSelectCategory}
                />
                {loadingProducts ? (
                    <div className="text-center py-20 text-gray-500">Loading products...</div>
                ) : (
                    <FeaturedProducts
                        products={products}
                        searchQuery={searchQuery}
                        selectedCategory={selectedCategory}
                        onAddToCart={onAddToCart}
                        // Pagination props
                        totalProducts={totalProducts}
                        currentPage={currentPage}
                        itemsPerPage={ITEMS_PER_PAGE}
                        onPageChange={setCurrentPage}
                    />
                )}
                <WhyChooseUs />
                <Contact />
            </main>
            <Footer />
        </div>
    );
}