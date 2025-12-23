import { ImageWithFallback } from "./figma/ImageWithFallback";

// Define the props interface
interface HeroProps {
    onShopNow: () => void;
    onRequestQuote: () => void;
}

export function Hero({ onShopNow, onRequestQuote }: HeroProps) {
    return (
        <section id="home" className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white">
            <div className="container mx-auto px-4 py-20 md:py-32">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                        <h1 className="mb-6">
                            Quality Automotive Parts for Every Vehicle
                        </h1>
                        <p className="mb-8 text-blue-100">
                            Your trusted supplier of genuine and aftermarket parts in the Philippines.
                            Fast delivery, competitive prices, and excellent customer service.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={onShopNow}
                                className="bg-white text-blue-900 px-8 py-3 rounded hover:bg-gray-100 transition font-medium cursor-pointer"
                            >
                                Shop Now
                            </button>
                            <button
                                onClick={onRequestQuote}
                                className="border-2 border-white text-white px-8 py-3 rounded hover:bg-white hover:text-blue-900 transition font-medium cursor-pointer"
                            >
                                Request Quote
                            </button>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-12 pt-12 border-t border-blue-600">
                            <div>
                                <div className="text-blue-100">Over</div>
                                <div>10,000+</div>
                                <div className="text-blue-100">Parts Available</div>
                            </div>
                            <div>
                                <div className="text-blue-100">Since</div>
                                <div>2015</div>
                                <div className="text-blue-100">Established</div>
                            </div>
                            <div>
                                <div className="text-blue-100">Serving</div>
                                <div>5,000+</div>
                                <div className="text-blue-100">Customers</div>
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <ImageWithFallback
                            src="https://images.unsplash.com/photo-1764699186616-8f707281e4f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvbW90aXZlJTIwcGFydHMlMjB3YXJlaG91c2V8ZW58MXx8fHwxNzY1MTUyNTU2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                            alt="Automotive parts warehouse"
                            className="rounded-lg shadow-2xl"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}