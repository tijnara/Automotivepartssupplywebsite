import { Search, ShoppingCart, Menu, X, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetDescription,
    SheetClose
} from "./ui/sheet";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { CartItem } from "../App";

interface HeaderProps {
    cartItems: CartItem[];
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    onRemoveItem: (id: number) => void;
    onUpdateQuantity: (id: number, delta: number) => void;
    onCheckout: () => void;
}

export function Header({
                           cartItems,
                           searchQuery,
                           setSearchQuery,
                           onRemoveItem,
                           onUpdateQuantity,
                       }: HeaderProps) {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const totalAmount = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const handleLogoClick = () => {
        navigate('/');
        window.scrollTo(0, 0);
    };

    return (
        <header className="sticky top-0 z-50 w-full shadow-md font-sans">
            {/* 1. Top Contact Bar (White/Light Grey) */}
            <div className="bg-gray-100 text-gray-600 text-[11px] md:text-xs py-1.5 border-b border-gray-200">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3" />
                        <span>Need Help? Call Us at <span className="font-semibold">+632 8 927 7777</span></span>
                    </div>
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-blue-600 transition-colors flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> Store Locator
                        </a>
                        <a href="#" className="hover:text-blue-600 transition-colors hidden sm:inline">Track Order</a>
                    </div>
                </div>
            </div>

            {/* 2. Main Header (Brand Blue) */}
            <div className="bg-blue-600 text-white py-4 md:py-5">
                <div className="container mx-auto px-4 flex items-center justify-between gap-4 md:gap-8">
                    {/* Logo Area */}
                    <div
                        className="flex items-center gap-1 cursor-pointer flex-shrink-0 group"
                        onClick={handleLogoClick}
                    >
                        <div className="font-black text-2xl md:text-3xl italic tracking-tighter group-hover:opacity-90 transition-opacity">
                            AUTOPARTS
                        </div>
                        <div className="bg-black text-white text-[9px] md:text-[10px] p-0.5 px-1 font-bold italic border border-white/20 rounded-[2px] tracking-wider">
                            PH
                        </div>
                    </div>

                    {/* Wide Search Bar (Desktop) */}
                    <div className="hidden md:flex flex-1 max-w-3xl relative">
                        <input
                            type="text"
                            placeholder="Search by Category, Part, Vehicle or Brand..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-10 pl-4 pr-12 text-gray-800 bg-white rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-400 text-sm"
                        />
                        <button className="absolute right-0 top-0 h-10 w-12 bg-black flex items-center justify-center rounded-r-sm hover:bg-gray-800 transition-colors cursor-pointer">
                            <Search className="w-5 h-5 text-white" />
                        </button>
                    </div>

                    {/* Cart & Mobile Menu */}
                    <div className="flex items-center gap-1 md:gap-4">
                        {/* Cart */}
                        <Sheet modal={false} open={isCartOpen} onOpenChange={setIsCartOpen}>
                            <SheetTrigger asChild>
                                <button className="flex items-center gap-2 hover:bg-blue-700 p-2 rounded transition-colors cursor-pointer">
                                    <div className="relative">
                                        <ShoppingCart className="w-6 h-6" />
                                        {itemCount > 0 && (
                                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full border border-blue-600">
                                                {itemCount}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-col items-start hidden sm:flex">
                                        <span className="text-[10px] opacity-80 leading-none">My Cart</span>
                                        <span className="font-bold text-sm leading-none">₱{totalAmount.toLocaleString()}</span>
                                    </div>
                                </button>
                            </SheetTrigger>
                            <SheetContent overlay={true} className="z-[100]">
                                <SheetHeader className="border-b pb-4">
                                    <SheetTitle>Shopping Cart</SheetTitle>
                                    <SheetDescription>Review your selected items</SheetDescription>
                                </SheetHeader>
                                <ScrollArea className="h-[calc(100vh-200px)] pr-4 mt-4">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex gap-4 mb-4 border-b pb-4 last:border-0">
                                            <div className="w-20 h-20 bg-gray-100 rounded-md flex-shrink-0 border border-gray-200">
                                                <ImageWithFallback src={item.image} className="w-full h-full object-cover rounded-md" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium line-clamp-2 mb-1">{item.name}</div>
                                                <div className="text-xs text-gray-500 mb-2">{item.category}</div>
                                                <div className="flex justify-between items-end">
                                                    <div className="text-sm text-blue-600 font-bold">₱{(item.price * item.quantity).toLocaleString()}</div>
                                                    <div className="flex items-center gap-2 border rounded-md bg-gray-50">
                                                        <button
                                                            onClick={() => onUpdateQuantity(item.id, -1)}
                                                            className="w-6 h-6 flex items-center justify-center hover:bg-gray-200 rounded-l-md"
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            -
                                                        </button>
                                                        <span className="text-xs w-4 text-center font-medium">{item.quantity}</span>
                                                        <button
                                                            onClick={() => onUpdateQuantity(item.id, 1)}
                                                            className="w-6 h-6 flex items-center justify-center hover:bg-gray-200 rounded-r-md"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => onRemoveItem(item.id)}
                                                    className="text-xs text-red-500 hover:underline mt-2 flex items-center gap-1"
                                                >
                                                    <X className="w-3 h-3" /> Remove
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {cartItems.length === 0 && (
                                        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                                            <ShoppingCart className="w-12 h-12 mb-2 opacity-20" />
                                            <p>Your cart is empty</p>
                                        </div>
                                    )}
                                </ScrollArea>
                                {cartItems.length > 0 && (
                                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t shadow-inner">
                                        <div className="flex justify-between font-bold text-lg mb-4">
                                            <span>Total</span>
                                            <span className="text-blue-600">₱{totalAmount.toLocaleString()}</span>
                                        </div>
                                        <SheetClose asChild>
                                            <Button onClick={() => navigate('/checkout')} className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base font-bold shadow-lg shadow-blue-600/20">
                                                Proceed to Checkout
                                            </Button>
                                        </SheetClose>
                                    </div>
                                )}
                            </SheetContent>
                        </Sheet>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden p-2 hover:bg-blue-700 rounded transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Mobile Search & Menu Container */}
                {isMobileMenuOpen && (
                    <div className="md:hidden container mx-auto px-4 pb-4 pt-2 space-y-4 animate-in slide-in-from-top-2">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-10 pl-4 pr-12 text-gray-800 bg-white rounded-sm focus:outline-none shadow-sm"
                            />
                            <button className="absolute right-0 top-0 h-10 w-12 bg-black flex items-center justify-center rounded-r-sm">
                                <Search className="w-5 h-5 text-white" />
                            </button>
                        </div>
                        <nav className="flex flex-col gap-2 text-white/90 font-medium">
                            <a href="#" className="py-2 border-b border-white/10">Home</a>
                            <a href="#" className="py-2 border-b border-white/10">Categories</a>
                            <a href="#" className="py-2 border-b border-white/10">Brands</a>
                            <a href="#" className="py-2 border-b border-white/10">All Products</a>
                        </nav>
                    </div>
                )}
            </div>

            {/* 3. Navigation Bar (White) - Desktop Only */}
            <div className="bg-white border-b border-gray-200 py-3 hidden md:block">
                <div className="container mx-auto px-4 flex justify-between items-center text-sm font-medium text-gray-700">
                    <ul className="flex gap-8">
                        <li className="hover:text-blue-600 cursor-pointer transition-colors relative group">
                            Home
                            <span className="absolute -bottom-3 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
                        </li>
                        <li className="hover:text-blue-600 cursor-pointer transition-colors relative group">
                            Categories
                            <span className="absolute -bottom-3 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
                        </li>
                        <li className="hover:text-blue-600 cursor-pointer transition-colors relative group">
                            Brands
                            <span className="absolute -bottom-3 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
                        </li>
                        <li className="hover:text-blue-600 cursor-pointer transition-colors relative group">
                            All Products
                            <span className="absolute -bottom-3 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
                        </li>
                        <li className="hover:text-blue-600 cursor-pointer transition-colors text-blue-600 font-bold relative group">
                            Online Exclusives
                            <span className="absolute -bottom-3 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
                        </li>
                        <li className="hover:text-red-500 cursor-pointer transition-colors text-red-500 font-bold relative group">
                            Clearance Sale
                            <span className="absolute -bottom-3 left-0 w-0 h-0.5 bg-red-500 transition-all group-hover:w-full"></span>
                        </li>
                    </ul>
                    <Button variant="default" className="bg-black text-white hover:bg-gray-800 rounded-sm h-8 text-xs px-4 font-bold tracking-wide">
                        STORE LOCATOR
                    </Button>
                </div>
            </div>
        </header>
    );
}