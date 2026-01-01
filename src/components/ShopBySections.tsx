export function ShopByParts() {
    const categories = [
        "Car Cover", "Exterior", "Horn", "Interior",
        "Air Fresheners", "Lighting", "Matting", "Mirror",
        "Safety & Security", "Batteries", "Steering Wheel", "Wiper"
    ];

    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-xl font-bold mb-6 text-gray-900">Shop by Parts</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 border-t border-l border-gray-200">
                    {categories.map((cat, idx) => (
                        <div key={idx} className="border-r border-b border-gray-200 p-6 flex flex-col items-center justify-center hover:bg-blue-50 cursor-pointer transition-colors text-center h-32 group">
                            <span className="font-semibold text-sm text-gray-700 group-hover:text-blue-600 transition-colors">{cat}</span>
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
        <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
                <h2 className="text-xl font-bold mb-6 text-gray-900">Shop By Car Brands</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 bg-white border border-gray-200">
                    {brands.map((brand, idx) => (
                        <div key={idx} className="border-r border-b border-gray-200 p-8 flex items-center justify-center hover:bg-gray-50 cursor-pointer h-28 group transition-colors">
                            <span className="font-black text-gray-300 text-xl group-hover:text-blue-600 transition-colors uppercase tracking-widest">{brand}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}