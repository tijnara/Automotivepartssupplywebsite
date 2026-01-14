import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { supabase } from "../lib/supabase";
import { Database } from "../types/database.types";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { CartItem } from "../App";

type Store = Database['public']['Tables']['stores']['Row'];

interface StoreLocatorProps {
    cartItems: CartItem[];
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    onRemoveItem: (id: number) => void;
    onUpdateQuantity: (id: number, delta: number) => void;
    onCheckout: () => void;
    // REMOVED: onNavigate is handled internally, not passed from App.tsx
    onAddToCart: (product: any) => void;
}

// HELPER: Extracts the URL if the user accidentally pasted the full <iframe...> code
const getCleanMapUrl = (input: string | null) => {
    if (!input) return null;
    // If it's already a URL, return it
    if (input.trim().startsWith('http')) return input;

    // Otherwise try to find the src="..." attribute
    const match = input.match(/src=["']([^"']+)["']/);
    return match ? match[1] : null;
};

export default function StoreLocator({
                                         cartItems,
                                         searchQuery,
                                         setSearchQuery,
                                         onRemoveItem,
                                         onUpdateQuantity,
                                         onCheckout
                                     }: StoreLocatorProps) {
    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchStores();
    }, []);

    const fetchStores = async () => {
        const { data, error } = await supabase
            .from('stores')
            .select('*')
            .eq('is_active', true)
            .order('name');

        if (!error && data) {
            setStores(data);
        }
        setLoading(false);
    };

    const handleHeaderNavigation = (section: string) => {
        if (section === 'home') {
            navigate('/');
        } else if (section === 'categories') {
            navigate('/', { state: { scrollTo: 'categories' } });
        } else if (section === 'all-products') {
            navigate('/', { state: { scrollTo: 'featured-products' } });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Header
                cartItems={cartItems}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onRemoveItem={onRemoveItem}
                onUpdateQuantity={onUpdateQuantity}
                onCheckout={onCheckout}
                onNavigate={handleHeaderNavigation}
            />

            <main className="flex-grow container mx-auto px-4 py-12 mt-[140px] md:mt-[160px]">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-black italic tracking-tighter text-blue-900 mb-4">OUR LOCATIONS</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Visit one of our stores nearest you. Our expert staff is ready to assist you with your automotive needs.
                    </p>
                </div>

                {loading ? (
                    <div className="text-center py-20 flex flex-col items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                        <p className="text-gray-500">Loading stores...</p>
                    </div>
                ) : stores.length === 0 ? (
                    <div className="text-center py-20 text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
                        No store locations found.
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {stores.map(store => {
                            const mapUrl = getCleanMapUrl(store.map_url);

                            return (
                                <div key={store.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-300">
                                    {/* Map Preview */}
                                    {mapUrl && (
                                        <div className="h-56 w-full bg-gray-100 border-b border-gray-100 relative group">
                                            <iframe
                                                src={mapUrl}
                                                width="100%"
                                                height="100%"
                                                style={{ border: 0 }}
                                                allowFullScreen
                                                loading="lazy"
                                                referrerPolicy="no-referrer-when-downgrade"
                                                className="grayscale group-hover:grayscale-0 transition-all duration-500"
                                            ></iframe>
                                        </div>
                                    )}

                                    <div className="p-6 flex flex-col flex-grow">
                                        <h3 className="font-bold text-xl text-gray-900 mb-4 flex items-center gap-2">
                                            <MapPin className="w-5 h-5 text-blue-600 fill-blue-100" />
                                            {store.name}
                                        </h3>

                                        <div className="space-y-4 text-sm text-gray-600 flex-grow">
                                            <div className="flex gap-3 items-start">
                                                <MapPin className="w-4 h-4 mt-1 text-gray-400 shrink-0" />
                                                <p className="leading-relaxed">{store.address}</p>
                                            </div>
                                            {store.phone && (
                                                <div className="flex gap-3 items-center">
                                                    <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                                                    <p className="font-medium">{store.phone}</p>
                                                </div>
                                            )}
                                            {store.email && (
                                                <div className="flex gap-3 items-center">
                                                    <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                                                    <a href={`mailto:${store.email}`} className="text-blue-600 hover:underline">{store.email}</a>
                                                </div>
                                            )}
                                            {store.hours && (
                                                <div className="flex gap-3 items-start bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                    <Clock className="w-4 h-4 mt-0.5 text-blue-600 shrink-0" />
                                                    <p className="text-xs font-medium text-gray-700">{store.hours}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}