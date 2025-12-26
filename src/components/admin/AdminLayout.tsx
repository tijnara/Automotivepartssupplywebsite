import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { LogOut, ExternalLink, Package, MessageSquare, ShoppingBag, ClipboardList } from "lucide-react";
import { supabase } from "../../lib/supabase";

interface AdminLayoutProps {
    children: React.ReactNode;
    title: string;
    description?: string;
}

export function AdminLayout({ children, title, description }: AdminLayoutProps) {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-50/50 flex flex-col">
            {/* Top Bar - Consistent with Client Header */}
            <div className="bg-blue-900 text-white py-2">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <div className="flex items-center gap-4 text-xs md:text-sm">
                        <span className="font-medium">Admin Control Panel</span>
                        <span className="hidden md:inline text-blue-300">|</span>
                        <span className="hidden md:inline text-blue-300">Logged in as Administrator</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate("/")}
                            className="flex items-center gap-2 hover:text-blue-200 transition text-xs md:text-sm cursor-pointer"
                        >
                            <ExternalLink className="w-4 h-4" />
                            <span>View Public Shop</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <header className="sticky top-0 z-40 w-full bg-white shadow-sm border-b border-gray-200">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <div className="bg-blue-600 text-white px-4 py-2 rounded font-bold cursor-pointer" onClick={() => navigate("/admin")}>
                                <span>AutoParts PH</span>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="hidden md:flex items-center gap-1">
                            <Button
                                variant={location.pathname === '/admin' ? "default" : "ghost"}
                                className={`gap-2 ${location.pathname === '/admin' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-blue-600'}`}
                                onClick={() => navigate("/admin")}
                            >
                                <Package className="w-4 h-4" />
                                Products
                            </Button>
                            <Button
                                variant={location.pathname === '/admin/inventory' ? "default" : "ghost"}
                                className={`gap-2 ${location.pathname === '/admin/inventory' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-blue-600'}`}
                                onClick={() => navigate("/admin/inventory")}
                            >
                                <ClipboardList className="w-4 h-4" />
                                Inventory
                            </Button>
                            <Button
                                variant={location.pathname === '/admin/orders' ? "default" : "ghost"}
                                className={`gap-2 ${location.pathname === '/admin/orders' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-blue-600'}`}
                                onClick={() => navigate("/admin/orders")}
                            >
                                <ShoppingBag className="w-4 h-4" />
                                Orders
                            </Button>
                            <Button
                                variant={location.pathname === '/admin/messages' ? "default" : "ghost"}
                                className={`gap-2 ${location.pathname === '/admin/messages' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-blue-600'}`}
                                onClick={() => navigate("/admin/messages")}
                            >
                                <MessageSquare className="w-4 h-4" />
                                Messages
                            </Button>
                        </nav>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleLogout}
                            className="border-gray-200 text-gray-600 hover:text-red-600 hover:border-red-100 hover:bg-red-50 transition-all"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>
            </header>

            {/* Content Area */}
            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{title}</h1>
                    {description && <p className="text-gray-500 mt-1">{description}</p>}
                </div>
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
                <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} AutoParts PH Admin. All rights reserved.
                </div>
            </footer>
        </div>
    );
}