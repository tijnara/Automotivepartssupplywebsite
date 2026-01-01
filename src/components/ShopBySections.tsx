import { Car, Wrench, Zap, Shield, Speaker, Thermometer } from "lucide-react";

export function ShopByParts() {
    const categories = [
        { name: "Car Cover", icon: Car },
        { name: "Exterior", icon: Shield },
        { name: "Horn", icon: Speaker },
        { name: "Interior", icon: Wrench },
        { name: "Air Fresheners", icon: Thermometer },
        { name: "Lighting", icon: Zap },
        { name: "Matting", icon: Car },
        { name: "Mirror", icon: Car },
        { name: "Safety & Security", icon: Shield },
        { name: "Batteries", icon: Zap },
        { name: "Steering Wheel", icon: Wrench },
        { name: "Wiper", icon: Car }
    ];

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold mb-8 text-gray-900">Shop by Parts</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 border-t border-l border-gray-200">
                    {categories.map((cat, idx) => (
                        <div key={idx} className="border-r border-b border-gray-200 p-6 flex flex-col items-center justify-center hover:bg-blue-50 cursor-pointer transition-all text-center h-40 group">
                            {/* Icon Placeholder - In real app use actual icons */}
                            <cat.icon className="w-8 h-8 text-gray-400 mb-3 group-hover:text-blue-600 transition-colors" strokeWidth={1.5} />
                            <span className="font-semibold text-sm text-gray-700 group-hover:text-blue-600 transition-colors">{cat.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function ShopByBrands() {
    const brands = [
        "TOYOTA", "HONDA", "MITSUBISHI",
        "NISSAN", "FORD", "CHEVROLET",
        "MAZDA", "HYUNDAI", "KIA"
    ];

    return (
        <section className="py-16 bg-gray-50 border-t border-gray-200">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold mb-8 text-gray-900">Shop By Car Brands</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 bg-white border border-gray-200 shadow-sm">
                    {brands.map((brand, idx) => (
                        <div key={idx} className="border-r border-b border-gray-200 p-10 flex items-center justify-center hover:bg-blue-50/50 cursor-pointer h-32 group transition-colors relative overflow-hidden">
                            {/* Simple text representation of logos */}
                            <span className="font-black text-gray-300 text-2xl group-hover:text-blue-600 transition-colors uppercase tracking-widest z-10">{brand}</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-blue-50/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}