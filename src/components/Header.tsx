import { Search, Phone, ShoppingCart, Menu, Plus, Minus, X } from "lucide-react";
import { useState } from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose,
    SheetDescription
} from "./ui/sheet";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
    category: string;
}

interface CartItem extends Product {
    quantity: number;
}

interface HeaderProps {
    cartItems: CartItem[];
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    onRemoveItem: (id: number) => void;
    onUpdateQuantity: (id: number, delta: number) => void;
}

export function Header({
                           cartItems,
                           searchQuery,
                           setSearchQuery,
                           onRemoveItem,
                           onUpdateQuantity
                       }: HeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const totalAmount = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return (
        // FIX 1: Changed to 'fixed top-0' to force it to stay visible.
        // Z-Index is 40. The Sheet (Cart) will be 100.
        <header className="fixed top-0 left-0 right-0 z-40 w-full bg-white shadow-sm">
            {/* Top Bar */}
            <div className="bg-blue-900 text-white py-2">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <a href="tel:+639171234567" className="flex items-center gap-2 hover:text-blue-200 transition">
                            <Phone className="w-4 h-4" />
                            <span>+63 917 123 4567</span>
                        </a>
                        <span className="hidden md:inline">|</span>
                        <span className="hidden md:inline">Mon - Sat: 8:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="hidden md:inline">Nationwide Delivery</span>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between gap-4">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-600 text-white px-4 py-2 rounded font-bold cursor-pointer" onClick={() => window.scrollTo(0,0)}>
                            <span>AutoParts PH</span>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="hidden md:flex flex-1 max-w-xl">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Search for parts by name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                            <button className="absolute right-0 top-0 bottom-0 bg-blue-600 text-white px-6 rounded-r hover:bg-blue-700 transition">
                                <Search className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Cart & Menu */}
                    <div className="flex items-center gap-4">
                        <Sheet modal={false}>
                            <SheetTrigger asChild>
                                <button className="relative hover:text-blue-600 transition">
                                    <ShoppingCart className="w-6 h-6" />
                                    {itemCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                                            {itemCount}
                                        </span>
                                    )}
                                </button>
                            </SheetTrigger>
                            <SheetContent overlay={false}>
                                <SheetHeader>
                                    <SheetTitle>Shopping Cart ({itemCount})</SheetTitle>
                                    <SheetDescription>
                                        Review your selected items.
                                    </SheetDescription>
                                </SheetHeader>

                                {cartItems.length === 0 ? (
                                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500" style={{ minHeight: '300px' }}>
                                        <ShoppingCart className="w-16 h-16 mb-4 opacity-20" />
                                        <p>Your cart is empty</p>
                                    </div>
                                ) : (
                                    <>
                                        <ScrollArea className="flex-1 -mx-6 px-6" style={{ flex: '1 1 0%', overflow: 'hidden' }}>
                                            <div className="space-y-4 py-4">
                                                {cartItems.map((item) => (
                                                    <div key={item.id} className="flex gap-4">
                                                        {/* FIX 2: Inline styles to force image container size. This fixes the giant image bug. */}
                                                        <div
                                                            className="bg-gray-100 rounded-md overflow-hidden flex-shrink-0"
                                                            style={{ width: '80px', height: '80px', minWidth: '80px' }}
                                                        >
                                                            <ImageWithFallback
                                                                src={item.image}
                                                                alt={item.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex-1 flex flex-col justify-between">
                                                            <div>
                                                                <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
                                                                <p className="text-xs text-gray-500">{item.category}</p>
                                                            </div>
                                                            <div className="flex justify-between items-center">
                                                                <div className="text-blue-600 font-medium">
                                                                    ₱{(item.price * item.quantity).toLocaleString()}
                                                                </div>
                                                                <div className="flex items-center gap-2 border rounded-md">
                                                                    <button
                                                                        onClick={() => onUpdateQuantity(item.id, -1)}
                                                                        className="p-1 hover:bg-gray-100 disabled:opacity-50"
                                                                        disabled={item.quantity <= 1}
                                                                    >
                                                                        <Minus className="w-3 h-3" />
                                                                    </button>
                                                                    <span className="text-xs w-4 text-center">{item.quantity}</span>
                                                                    <button
                                                                        onClick={() => onUpdateQuantity(item.id, 1)}
                                                                        className="p-1 hover:bg-gray-100"
                                                                    >
                                                                        <Plus className="w-3 h-3" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => onRemoveItem(item.id)}
                                                            className="text-gray-400 hover:text-red-500 self-start"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </ScrollArea>

                                        <div className="space-y-4 pt-4 mt-auto border-t">
                                            <div className="flex justify-between items-center font-medium text-lg">
                                                <span>Total:</span>
                                                <span>₱{totalAmount.toLocaleString()}</span>
                                            </div>
                                            <SheetClose asChild>
                                                <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-lg">
                                                    Checkout
                                                </Button>
                                            </SheetClose>
                                        </div>
                                    </>
                                )}
                            </SheetContent>
                        </Sheet>

                        <button
                            className="md:hidden"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Mobile Search */}
                <div className="md:hidden mt-4">
                    <div className="relative w-full">
                        <input
                            type="text"
                            placeholder="Search parts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                        <button className="absolute right-0 top-0 bottom-0 bg-blue-600 text-white px-6 rounded-r hover:bg-blue-700 transition">
                            <Search className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className={`bg-gray-50 border-t ${isMenuOpen ? 'block' : 'hidden md:block'}`}>
                <div className="container mx-auto px-4">
                    <ul className="flex flex-col md:flex-row md:items-center md:gap-8 py-2">
                        <li><a href="#home" className="block py-2 hover:text-blue-600 transition">Home</a></li>
                        <li><a href="#products" className="block py-2 hover:text-blue-600 transition">Products</a></li>
                        <li><a href="#brands" className="block py-2 hover:text-blue-600 transition">Brands</a></li>
                        <li><a href="#about" className="block py-2 hover:text-blue-600 transition">About Us</a></li>
                        <li><a href="#contact" className="block py-2 hover:text-blue-600 transition">Contact</a></li>
                    </ul>
                </div>
            </nav>
        </header>
    );
}