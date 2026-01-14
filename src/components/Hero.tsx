import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi
} from "./ui/carousel";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { MapPin, ShieldCheck, Truck } from "lucide-react";
import { supabase } from "../lib/supabase";

interface HeroProps {
    onShopNow: () => void;
    onRequestQuote: () => void;
}

export function Hero({ onShopNow }: HeroProps) {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const [dbSlides, setDbSlides] = useState<any[]>([]);

    useEffect(() => {
        const fetchSlides = async () => {
            const { data } = await supabase
                .from('hero_slides')
                .select('*')
                .eq('is_active', true)
                .order('created_at', { ascending: true });

            if (data && data.length > 0) {
                setDbSlides(data);
            }
        };
        fetchSlides();
    }, []);

    const defaultSlides = [
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1920",
            title: "ALL THE BIGGEST BRANDS ARE HERE",
            subtitle: "AT THE COUNTRY'S LARGEST CAR ACCESSORIES CHAIN STORE!",
            brands: true
        },
        {
            id: 2,
            image: "https://images.unsplash.com/photo-1503376763036-066120622c74?auto=format&fit=crop&q=80&w=1920",
            title: "QUALITY PARTS FOR EVERY VEHICLE",
            subtitle: "GENUINE PARTS • AFTERMARKET • ACCESSORIES",
            brands: false
        },
        {
            id: 3,
            image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1920",
            title: "NATIONWIDE DELIVERY",
            subtitle: "WE SHIP ANYWHERE IN THE PHILIPPINES",
            brands: false
        }
    ];

    const activeSlides = dbSlides.length > 0
        ? dbSlides.map(s => ({
            id: s.id,
            image: s.image_url,
            title: s.title,
            subtitle: s.subtitle,
            brands: false
        }))
        : defaultSlides;

    useEffect(() => {
        if (!api) return;
        const interval = setInterval(() => { api.scrollNext(); }, 5000);
        return () => clearInterval(interval);
    }, [api]);

    useEffect(() => {
        if (!api) return;
        setCurrent(api.selectedScrollSnap() + 1);
        api.on("select", () => { setCurrent(api.selectedScrollSnap() + 1); });
    }, [api]);

    const brandLogos = ["TOYOTA", "MITSUBISHI", "HONDA", "NISSAN", "BOSCH", "SPARCO", "MOTUL", "3M"];

    return (
        <section id="home" className="relative bg-gray-900">
            <Carousel setApi={setApi} className="w-full relative" opts={{ loop: true }}>
                <CarouselContent className="-ml-0 flex">
                    {activeSlides.map((slide) => (
                        <CarouselItem
                            key={slide.id}
                            className="pl-0 min-w-0 shrink-0 grow-0 basis-full"
                            style={{ minWidth: "100%", flex: "0 0 100%" }} // FORCE 100% WIDTH
                        >
                            {/* Fixed Height Container: 600px mobile / 800px desktop */}
                            <div className="relative w-full h-[600px] md:h-[950px] overflow-hidden bg-gray-900 group">

                                {/* Background Image - Forced Coverage */}
                                <div className="absolute inset-0 z-0 w-full h-full">
                                    <ImageWithFallback
                                        src={slide.image}
                                        alt={slide.title || "Hero Image"}
                                        className="block opacity-90"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            objectPosition: 'center'
                                        }}
                                    />
                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-transparent mix-blend-multiply z-10"></div>
                                </div>

                                {/* Content Overlay */}
                                <div className="relative h-full container mx-auto px-4 flex flex-col justify-center items-center text-center z-20 text-white pb-16">
                                    {slide.title && (
                                        <h1 className="text-4xl md:text-7xl font-black italic tracking-tighter mb-6 drop-shadow-xl max-w-5xl leading-tight">
                                            {slide.title}
                                        </h1>
                                    )}
                                    {slide.subtitle && (
                                        <p className="text-sm md:text-2xl font-bold uppercase tracking-widest mb-10 text-blue-100 shadow-sm bg-blue-900/60 px-6 py-2 rounded backdrop-blur-sm">
                                            {slide.subtitle}
                                        </p>
                                    )}

                                    <Button
                                        onClick={onShopNow}
                                        className="bg-white text-blue-900 hover:bg-gray-200 font-bold py-7 px-12 rounded-sm text-xl shadow-2xl border-none transition-transform hover:scale-105"
                                    >
                                        SHOP NOW
                                    </Button>

                                    {slide.brands && (
                                        <div className="mt-20 w-full overflow-hidden">
                                            <div className="flex justify-center flex-wrap gap-8 md:gap-16 opacity-90">
                                                {brandLogos.map(brand => (
                                                    <span key={brand} className="text-2xl md:text-3xl font-black text-white italic drop-shadow-lg">
                                                        {brand}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {/* Navigation Buttons */}
                <div className="hidden md:block">
                    <CarouselPrevious className="absolute left-6 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white text-white hover:text-blue-900 border-none h-14 w-14 rounded-full flex items-center justify-center cursor-pointer backdrop-blur-md transition-all" />
                    <CarouselNext className="absolute right-6 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white text-white hover:text-blue-900 border-none h-14 w-14 rounded-full flex items-center justify-center cursor-pointer backdrop-blur-md transition-all" />
                </div>

                {/* Dots Indicator */}
                <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-30">
                    {activeSlides.map((_, index) => (
                        <button
                            key={index}
                            className={`h-3 rounded-full transition-all duration-300 shadow-sm ${
                                current === index + 1 ? "bg-white w-10" : "bg-white/40 w-3 hover:bg-white/60"
                            }`}
                            onClick={() => api?.scrollTo(index)}
                        />
                    ))}
                </div>
            </Carousel>

            {/* Bottom Info Bar */}
            <div className="bg-blue-600 text-white py-5 border-t border-blue-500 relative z-30">
                <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-sm md:text-base font-bold tracking-wide">
                    <div className="flex items-center justify-center gap-3">
                        <Truck className="w-6 h-6" />
                        <span>Fast Nationwide Delivery</span>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                        <ShieldCheck className="w-6 h-6" />
                        <span>100% Genuine Parts Guaranteed</span>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                        <MapPin className="w-6 h-6" />
                        <span>50+ Stores Across Philippines</span>
                    </div>
                </div>
            </div>
        </section>
    );
}