import { Facebook, Instagram, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="bg-blue-600 text-white px-4 py-2 rounded inline-block mb-4">
              <span>AutoParts PH</span>
            </div>
            <p className="mb-4">
              Your trusted automotive parts supplier in the Philippines since 2015.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition">
                <Mail className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition">
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#home" className="hover:text-white transition">Home</a></li>
              <li><a href="#products" className="hover:text-white transition">Products</a></li>
              <li><a href="#brands" className="hover:text-white transition">Brands</a></li>
              <li><a href="#about" className="hover:text-white transition">About Us</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white mb-4">Categories</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition">Engine Parts</a></li>
              <li><a href="#" className="hover:text-white transition">Brake System</a></li>
              <li><a href="#" className="hover:text-white transition">Electrical</a></li>
              <li><a href="#" className="hover:text-white transition">Suspension</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition">Shipping Info</a></li>
              <li><a href="#" className="hover:text-white transition">Returns Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Warranty</a></li>
              <li><a href="#contact" className="hover:text-white transition">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center">
          <p>&copy; 2024 AutoParts PH. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
