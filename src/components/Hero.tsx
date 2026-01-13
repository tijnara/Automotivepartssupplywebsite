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

    // 1. Fetch Slides from Database
    useEffect(() => {
        const fetchSlides = async () => {
            const { data } = await supabase
                .from('hero_slides')
                .select('*')
                .eq('is_active', true)
                .order('created_at', { ascending: true }); // Show in order of upload

            if (data && data.length > 0) {
                setDbSlides(data);
            }
        };
        fetchSlides();
    }, []);

    // 2. Default Slides (Fallback)
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

    // Decide which slides to show
    const activeSlides = dbSlides.length > 0
        ? dbSlides.map(s => ({
            id: s.id,
            image: s.image_url,
            title: s.title,
            subtitle: s.subtitle,
            brands: false
        }))
        : defaultSlides;

    // Auto-slide functionality
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
                <CarouselContent className="-ml-0">
                    {activeSlides.map((slide) => (
                        <CarouselItem
                            key={slide.id}
                            className="pl-0 min-w-0 shrink-0 grow-0 basis-full w-full"
                        >
                            {/* CONTAINER HEIGHT FIX:
                                - h-[500px] for mobile
                                - md:h-[650px] for desktop
                            */}
                            <div className="relative w-full h-[500px] md:h-[650px] overflow-hidden bg-gray-900 group">

                                {/* IMAGE FIX:
                                    - absolute inset-0: Locks image to corners
                                    - w-full h-full: Forces filling the parent
                                    - object-cover: Zooms image to cover without distortion
                                */}
                                <div className="absolute inset-0 z-0 w-full h-full">
                                    <ImageWithFallback
                                        src={slide.image}
                                        alt={slide.title || "Hero Image"}
                                        className="w-full h-full object-cover opacity-80"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-transparent mix-blend-multiply"></div>
                                </div>

                                {/* Content Overlay */}
                                <div className="relative h-full container mx-auto px-4 flex flex-col justify-center items-center text-center z-10 text-white pb-12">
                                    {slide.title && (
                                        <h1 className="text-3xl md:text-6xl font-black italic tracking-tighter mb-4 drop-shadow-xl max-w-4xl leading-tight">
                                            {slide.title}
                                        </h1>
                                    )}
                                    {slide.subtitle && (
                                        <p className="text-sm md:text-xl font-bold uppercase tracking-widest mb-8 text-blue-100 shadow-sm bg-blue-900/50 px-4 py-1 rounded">
                                            {slide.subtitle}
                                        </p>
                                    )}

                                    <Button
                                        onClick={onShopNow}
                                        className="bg-white text-blue-900 hover:bg-gray-200 font-bold py-6 px-10 rounded-sm text-lg shadow-xl border-none transition-transform hover:scale-105"
                                    >
                                        SHOP NOW
                                    </Button>

                                    {slide.brands && (
                                        <div className="mt-16 w-full overflow-hidden">
                                            <div className="flex justify-center flex-wrap gap-6 md:gap-12 opacity-80">
                                                {brandLogos.map(brand => (
                                                    <span key={brand} className="text-xl md:text-2xl font-black text-white italic drop-shadow-md">
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
                    <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white text-white hover:text-blue-900 border-none h-12 w-12 rounded-full flex items-center justify-center cursor-pointer backdrop-blur-sm" />
                    <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white text-white hover:text-blue-900 border-none h-12 w-12 rounded-full flex items-center justify-center cursor-pointer backdrop-blur-sm" />
                </div>

                {/* Dots */}
                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
                    {activeSlides.map((_, index) => (
                        <button
                            key={index}
                            className={`h-2 rounded-full transition-all duration-300 ${
                                current === index + 1 ? "bg-white w-8" : "bg-white/40 w-2"
                            }`}
                            onClick={() => api?.scrollTo(index)}
                        />
                    ))}
                </div>
            </Carousel>

            <div className="bg-blue-600 text-white py-4 border-t border-blue-500 relative z-20">
                <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-sm font-medium">
                    <div className="flex items-center justify-center gap-2">
                        <Truck className="w-5 h-5" />
                        <span>Fast Nationwide Delivery</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                        <ShieldCheck className="w-5 h-5" />
                        <span>100% Genuine Parts Guaranteed</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                        <MapPin className="w-5 h-5" />
                        <span>50+ Stores Across Philippines</span>
                    </div>
                </div>
            </div>
        </section>
    );
}