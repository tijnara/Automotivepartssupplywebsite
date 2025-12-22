import { useState } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { ProductCategories } from "./components/ProductCategories";
import { FeaturedProducts, Product } from "./components/FeaturedProducts";
import { WhyChooseUs } from "./components/WhyChooseUs";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";

// Define Cart Item Type
export interface CartItem extends Product {
    quantity: number;
}

export default function App() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    const handleAddToCart = (product: Product) => {
        setCartItems((prev) => {
            const existingItem = prev.find((item) => item.id === product.id);
            if (existingItem) {
                // Increment quantity if exists
                toast.info(`Increased quantity of ${product.name}`);
                return prev.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            // Add new item
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

    return (
        <div className="min-h-screen">
            <Header
                cartItems={cartItems}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onRemoveItem={handleRemoveFromCart}
                onUpdateQuantity={handleUpdateQuantity}
            />
            <main>
                <Hero />
                <ProductCategories />
                <FeaturedProducts
                    searchQuery={searchQuery}
                    onAddToCart={handleAddToCart}
                />
                <WhyChooseUs />
                <Contact />
            </main>
            <Footer />
            <Toaster />
        </div>
    );
}