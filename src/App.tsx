import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import PublicShop from "./pages/PublicShop";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminOrders from "./pages/admin/AdminOrders";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/Checkout"; // Import the new Checkout Page
import { supabase } from "./lib/supabase";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";

// Define shared types
export interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    original_price: number | null;
    rating: number | null;
    reviews: number | null;
    in_stock: boolean;
    image: string;
}

export interface CartItem extends Product {
    quantity: number;
}

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    if (!session) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export default function App() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    const handleAddToCart = (product: any, qty: number = 1) => {
        const itemToAdd: CartItem = {
            id: product.id,
            name: product.name,
            category: product.category,
            price: Number(product.price),
            original_price: product.original_price ?? product.originalPrice ?? null,
            rating: product.rating,
            reviews: product.reviews,
            in_stock: product.in_stock ?? product.inStock ?? true,
            image: product.image,
            quantity: qty
        };

        setCartItems((prev) => {
            const existingItem = prev.find((item) => item.id === itemToAdd.id);
            if (existingItem) {
                toast.info(`Increased quantity of ${itemToAdd.name}`);
                return prev.map((item) =>
                    item.id === itemToAdd.id
                        ? { ...item, quantity: item.quantity + qty }
                        : item
                );
            }
            toast.success(`${itemToAdd.name} added to cart!`);
            return [...prev, { ...itemToAdd }];
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

    // This is passed to components but will be overridden/ignored by Header's internal navigation
    // or we can keep it empty as a placeholder.
    const handleCheckoutPlaceholder = () => {
        // No-op: Navigation is handled in Header.tsx via useNavigate('/checkout')
    };

    const handleConfirmOrder = async (orderData: any) => {
        try {
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert([{
                    customer_name: orderData.customer_name,
                    customer_email: orderData.customer_email,
                    customer_phone: orderData.customer_phone,
                    total_amount: orderData.total_amount,
                    status: "pending"
                }])
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
            throw error;
        }
    };

    const cartProps = {
        cartItems,
        searchQuery,
        setSearchQuery,
        onRemoveItem: handleRemoveFromCart,
        onUpdateQuantity: handleUpdateQuantity,
        onCheckout: handleCheckoutPlaceholder,
        onAddToCart: handleAddToCart
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<PublicShop {...cartProps} />} />
                <Route path="/product/:id" element={<ProductDetails {...cartProps} />} />

                {/* New Checkout Route */}
                <Route path="/checkout" element={
                    <Checkout
                        {...cartProps}
                        onConfirmOrder={handleConfirmOrder}
                    />
                } />

                <Route path="/login" element={<AdminLogin />} />
                <Route path="/admin" element={<ProtectedRoute><AdminProducts /></ProtectedRoute>} />
                <Route path="/admin/messages" element={<ProtectedRoute><AdminMessages /></ProtectedRoute>} />
                <Route path="/admin/orders" element={<ProtectedRoute><AdminOrders /></ProtectedRoute>} />
            </Routes>
            <Toaster />
        </BrowserRouter>
    );
}