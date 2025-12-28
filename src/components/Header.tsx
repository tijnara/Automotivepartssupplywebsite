import { Search, Phone, ShoppingCart, Menu, Plus, Minus, X, Car } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import { Vehicle } from "./VehicleSelector";

interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
    category: string;
}

// Updated CartItem to match App.tsx
interface CartItem extends Product {
    quantity: number;
    vehicle?: Vehicle;
}

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
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const totalAmount = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const handleNavClick = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        setIsMenuOpen(false);
        setIsCartOpen(false);

        if (location.pathname === '/') {
            scrollToSection(id);
        } else {
            navigate(`/#${id}`);
        }
    };

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const headerOffset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    };

    const handleLogoClick = () => {
        setIsCartOpen(false);
        setIsMenuOpen(false);
        if (location.pathname === '/') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            navigate('/');
        }
    };

    const handleCheckoutClick = () => {
        setIsCartOpen(false);
        navigate('/checkout');
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-white shadow-md">
            {/* Top Bar */}
            <div className="bg-blue-900 text-white py-2">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <a href="tel:+639171234567" className="flex items-center gap-2 hover:text-blue-200 transition cursor-pointer">
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
                        <div
                            className="bg-blue-600 text-white px-4 py-2 rounded font-bold cursor-pointer hover:bg-blue-700 transition"
                            onClick={handleLogoClick}
                        >
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
                            <button className="absolute right-0 top-0 bottom-0 bg-blue-600 text-white px-6 rounded-r hover:bg-blue-700 transition cursor-pointer">
                                <Search className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Cart & Menu */}
                    <div className="flex items-center gap-4">
                        {/* Cart Sidebar */}
                        <Sheet modal={false} open={isCartOpen} onOpenChange={setIsCartOpen}>
                            <SheetTrigger asChild>
                                <button className="relative hover:text-blue-600 transition cursor-pointer">
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
                                                {cartItems.map((item, index) => (
                                                    <div key={`${item.id}-${index}`} className="flex gap-4 border-b pb-4 last:border-0">
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
                                                                {/* Display selected vehicle info */}
                                                                {item.vehicle && (
                                                                    <div className="flex items-center gap-1 mt-1 text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded w-fit">
                                                                        <Car className="w-3 h-3" />
                                                                        <span>Fits: {item.vehicle.make} {item.vehicle.model}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="flex justify-between items-center mt-2">
                                                                <div className="text-blue-600 font-medium">
                                                                    ₱{(item.price * item.quantity).toLocaleString()}
                                                                </div>
                                                                <div className="flex items-center gap-2 border rounded-md">
                                                                    <button
                                                                        onClick={() => onUpdateQuantity(item.id, -1)}
                                                                        className="p-1 hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
                                                                        disabled={item.quantity <= 1}
                                                                    >
                                                                        <Minus className="w-3 h-3" />
                                                                    </button>
                                                                    <span className="text-xs w-4 text-center">{item.quantity}</span>
                                                                    <button
                                                                        onClick={() => onUpdateQuantity(item.id, 1)}
                                                                        className="p-1 hover:bg-gray-100 cursor-pointer"
                                                                    >
                                                                        <Plus className="w-3 h-3" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => onRemoveItem(item.id)}
                                                            className="text-gray-400 hover:text-red-500 self-start cursor-pointer -mt-1 -mr-1 p-1"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </ScrollArea>

                                        <div className="space-y-4 pt-4 mt-auto border-t bg-white">
                                            <div className="flex justify-between items-center font-medium text-lg">
                                                <span>Total:</span>
                                                <span>₱{totalAmount.toLocaleString()}</span>
                                            </div>
                                            <SheetClose asChild>
                                                <Button
                                                    onClick={handleCheckoutClick}
                                                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-lg cursor-pointer"
                                                >
                                                    Checkout
                                                </Button>
                                            </SheetClose>
                                        </div>
                                    </>
                                )}
                            </SheetContent>
                        </Sheet>

                        {/* Mobile Menu Trigger */}
                        <button
                            className="md:hidden cursor-pointer"
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
                        <button className="absolute right-0 top-0 bottom-0 bg-blue-600 text-white px-6 rounded-r hover:bg-blue-700 transition cursor-pointer">
                            <Search className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className={`bg-gray-50 border-t ${isMenuOpen ? 'block' : 'hidden md:block'}`}>
                <div className="container mx-auto px-4">
                    <ul className="flex flex-col md:flex-row md:items-center md:gap-8 py-2">
                        <li><a href="#home" onClick={(e) => handleNavClick(e, 'home')} className="block py-2 hover:text-blue-600 transition cursor-pointer">Home</a></li>
                        <li><a href="#products" onClick={(e) => handleNavClick(e, 'products')} className="block py-2 hover:text-blue-600 transition cursor-pointer">Products</a></li>
                        <li><a href="#products" onClick={(e) => handleNavClick(e, 'products')} className="block py-2 hover:text-blue-600 transition cursor-pointer">Brands</a></li>
                        <li><a href="#about" onClick={(e) => handleNavClick(e, 'about')} className="block py-2 hover:text-blue-600 transition cursor-pointer">About Us</a></li>
                        <li><a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className="block py-2 hover:text-blue-600 transition cursor-pointer">Contact</a></li>
                    </ul>
                </div>
            </nav>
        </header>
    );
}