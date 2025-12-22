import { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { ProductCategories } from "../components/ProductCategories";
import { FeaturedProducts, Product } from "../components/FeaturedProducts";
import { WhyChooseUs } from "../components/WhyChooseUs";
import { Contact } from "../components/Contact";
import { Footer } from "../components/Footer";
import { toast } from "sonner";
import { supabase } from "../lib/supabase";

export interface CartItem extends Product {
    quantity: number;
}

export default function PublicShop() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
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

    const handleAddToCart = (product: Product) => {
        setCartItems((prev) => {
            const existingItem = prev.find((item) => item.id === product.id);
            if (existingItem) {
                toast.info(`Increased quantity of ${product.name}`);
                return prev.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            toast.success(`${product.name} added to cart!`);
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const handleRemoveFromCart = (id: number) => {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
        toast.error("Item removed from cart");
    };

    const handleUpdateQuantity = (id: number, delta: number) => {
        setCartItems((prev) =>
            prev.map(item => {
                if (item.id === id) {
                    const newQuantity = Math.max(1, item.quantity + delta);
                    return { ...item, quantity: newQuantity };
                }
                return item;
            })
        );
    };

    const handleSelectCategory = (category: string | null) => {
        setSelectedCategory(category);
        scrollToSection('featured-products');
    };

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            // Offset for the fixed header
            const headerOffset = 180;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    };

    const handleCheckout = async () => {
        if (cartItems.length === 0) return;

        const totalAmount = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

        const orderData = {
            customer_name: "Guest User",
            customer_email: "guest@example.com",
            customer_phone: "",
            total_amount: totalAmount,
            status: "pending"
        };

        try {
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert([orderData])
                .select()
                .single();

            if (orderError) throw orderError;

            if (order) {
                const orderItems = cartItems.map(item => ({
                    order_id: order.id,
                    product_id: item.id,
                    quantity: item.quantity,
                    price_at_purchase: item.price
                }));

                const { error: itemsError } = await supabase
                    .from('order_items')
                    .insert(orderItems);

                if (itemsError) throw itemsError;

                setCartItems([]);
                toast.success("Order placed successfully! Thank you.");
            }
        } catch (error: any) {
            console.error("Checkout error:", error);
            toast.error("Checkout failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen">
            <Header
                cartItems={cartItems}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onRemoveItem={handleRemoveFromCart}
                onUpdateQuantity={handleUpdateQuantity}
                onCheckout={handleCheckout}
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
                        onAddToCart={handleAddToCart}
                    />
                )}
                <WhyChooseUs />
                <Contact />
            </main>
            <Footer />
        </div>
    );
}