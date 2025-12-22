import { useState } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { ProductCategories } from "./components/ProductCategories";
import { FeaturedProducts } from "./components/FeaturedProducts";
import { WhyChooseUs } from "./components/WhyChooseUs";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { Toaster } from "./components/ui/sonner"; // Import Toaster
import { toast } from "sonner";

export default function App() {
    const [cartCount, setCartCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");

    const handleAddToCart = (productName: string) => {
        setCartCount((prev) => prev + 1);
        toast.success(`${productName} added to cart!`);
    };

    return (
        <div className="min-h-screen">
            <Header
                cartCount={cartCount}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />
            <main>
                <Hero />
                <ProductCategories />
                {/* Pass search and cart functions to products */}
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