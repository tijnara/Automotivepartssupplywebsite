import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PublicShop from "./pages/PublicShop"; // Ensure you renamed your old App.tsx to this
import AdminLogin from "./pages/admin/AdminLogin";
import AdminProducts from "./pages/admin/AdminProducts";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import { Toaster } from "./components/ui/sonner";

// Protected Route Wrapper
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
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<PublicShop />} />

                {/* Admin Routes */}
                <Route path="/login" element={<AdminLogin />} />
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute>
                            <AdminProducts />
                        </ProtectedRoute>
                    }
                />
            </Routes>
            <Toaster />
        </BrowserRouter>
    );
}