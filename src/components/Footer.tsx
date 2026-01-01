import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"; // Removed unused 'Mail'

export function Footer() {
    return (
        <footer className="bg-gray-100 pt-16 pb-8 border-t border-gray-200 text-gray-600 text-sm font-sans">
            <div className="container mx-auto px-4">
                {/* About Section */}
                <div className="text-center max-w-4xl mx-auto mb-16">
                    <h3 className="text-2xl font-black text-gray-900 mb-4 italic tracking-tight">About AutoParts PH</h3>
                    <p className="mb-4 leading-relaxed text-gray-600 max-w-2xl mx-auto">
                        <span className="font-bold text-gray-900">AutoParts PH</span> is the Philippines' premier car accessories online store chain.
                        We are dedicated to bringing our products and services closer to our customers. Unlike brick and mortar stores, we are open 24/7 to serve your automotive needs anywhere in the country.
                    </p>
                </div>

                {/* Links Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 border-t border-gray-200 pt-12">
                    <div className="text-center md:text-left">
                        <h4 className="font-bold text-gray-900 mb-6 uppercase text-xs tracking-widest">Information</h4>
                        <ul className="space-y-3">
                            <li><a href="#" className="hover:text-blue-600 transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-blue-600 transition-colors">Store Locator</a></li>
                            <li><a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-blue-600 transition-colors">Careers</a></li>
                        </ul>
                    </div>
                    <div className="text-center md:text-left">
                        <h4 className="font-bold text-gray-900 mb-6 uppercase text-xs tracking-widest">Customer Care</h4>
                        <ul className="space-y-3">
                            <li><a href="#" className="hover:text-blue-600 transition-colors">Contact Us</a></li>
                            <li><a href="#" className="hover:text-blue-600 transition-colors">Returns & Exchange</a></li>
                            <li><a href="#" className="hover:text-blue-600 transition-colors">Shipping Info</a></li>
                            <li><a href="#" className="hover:text-blue-600 transition-colors">FAQs</a></li>
                            <li><a href="#" className="hover:text-blue-600 transition-colors">Warranty</a></li>
                        </ul>
                    </div>
                    <div className="text-center md:text-left">
                        <h4 className="font-bold text-gray-900 mb-6 uppercase text-xs tracking-widest">My Account</h4>
                        <ul className="space-y-3">
                            <li><a href="#" className="hover:text-blue-600 transition-colors">Login / Register</a></li>
                            <li><a href="#" className="hover:text-blue-600 transition-colors">Order History</a></li>
                            <li><a href="#" className="hover:text-blue-600 transition-colors">Wishlist</a></li>
                            <li><a href="#" className="hover:text-blue-600 transition-colors">Track Order</a></li>
                        </ul>
                    </div>
                    <div className="text-center md:text-left">
                        <h4 className="font-bold text-gray-900 mb-6 uppercase text-xs tracking-widest">Follow Us</h4>
                        <p className="mb-4 text-xs">Stay updated with our latest offers.</p>
                        <div className="flex justify-center md:justify-start gap-4">
                            <a href="#" className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors"><Facebook className="w-4 h-4"/></a>
                            <a href="#" className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors"><Instagram className="w-4 h-4"/></a>
                            <a href="#" className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors"><Twitter className="w-4 h-4"/></a>
                            <a href="#" className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors"><Youtube className="w-4 h-4"/></a>
                        </div>
                    </div>
                </div>

                <div className="text-center border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
                    <p>&copy; {new Date().getFullYear()} AutoParts PH. All rights reserved.</p>
                    <div className="flex gap-4">
                        <span>Visa</span>
                        <span>Mastercard</span>
                        <span>PayPal</span>
                        <span>GCash</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}