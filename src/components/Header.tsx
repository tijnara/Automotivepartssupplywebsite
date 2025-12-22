import { Search, Phone, ShoppingCart, Menu } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
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
            <div className="bg-blue-600 text-white px-4 py-2 rounded">
              <span>AutoParts PH</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for parts by name or part number..."
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
            <button className="relative hover:text-blue-600 transition">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </button>
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
