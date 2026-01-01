import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function HomeBanners() {
    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Banner 1: Parts & Accessories */}
                    <div className="relative rounded-lg overflow-hidden min-h-[300px] flex flex-col justify-center p-10 group shadow-lg border border-gray-100 bg-gray-900">
                        <div className="absolute inset-0 z-0">
                            <ImageWithFallback
                                src="https://images.unsplash.com/photo-1486262715619-72a6075f1519?auto=format&fit=crop&q=80&w=1000"
                                alt="Car Engine Parts"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>
                        </div>

                        <div className="relative z-10 max-w-md">
                            <h3 className="text-3xl font-bold text-white mb-3 tracking-tight">Parts & Accessories</h3>
                            <p className="text-gray-200 mb-8 text-sm leading-relaxed font-medium">
                                Upgrade your ride with our premium selection of genuine parts and stylish accessories.
                            </p>
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-8 py-6 font-bold text-sm uppercase tracking-wide transition-all shadow-md group-hover:translate-x-2 border-0">
                                Shop Parts <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Banner 2: Performance & Tools */}
                    <div className="relative rounded-lg overflow-hidden min-h-[300px] flex flex-col justify-center p-10 group shadow-lg border border-gray-100 bg-gray-900">
                        <div className="absolute inset-0 z-0">
                            <ImageWithFallback
                                src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1000"
                                alt="Mechanic Tools"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>
                        </div>

                        <div className="relative z-10 max-w-md">
                            <h3 className="text-3xl font-bold text-white mb-3 tracking-tight">Performance & Tools</h3>
                            <p className="text-gray-200 mb-8 text-sm leading-relaxed font-medium">
                                Professional-grade tools and performance upgrades for the serious enthusiast.
                            </p>
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-8 py-6 font-bold text-sm uppercase tracking-wide transition-all shadow-md group-hover:translate-x-2 border-0">
                                Shop Tools <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}