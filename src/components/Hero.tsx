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
import { cn } from "./ui/utils";

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

    // Helper maps for sizing
    const titleSizes: Record<string, string> = {
        small: "text-2xl md:text-4xl",
        medium: "text-3xl md:text-5xl",
        large: "text-4xl md:text-7xl",
        xl: "text-5xl md:text-8xl",
    };

    const subtitleSizes: Record<string, string> = {
        small: "text-xs md:text-sm",
        medium: "text-sm md:text-lg",
        large: "text-base md:text-2xl",
    };

    const alignClasses: Record<string, string> = {
        left: "items-start text-left pl-8 md:pl-20",
        center: "items-center text-center",
        right: "items-end text-right pr-8 md:pr-20",
    };

    const defaultSlides = [
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1920",
            title: "ALL THE BIGGEST BRANDS ARE HERE",
            subtitle: "AT THE COUNTRY'S LARGEST CAR ACCESSORIES CHAIN STORE!",
            brands: true,
            titleColor: '#ffffff',
            titleSize: 'large',
            subtitleColor: '#ffffff',
            subtitleSize: 'medium',
            align: 'center'
        },
        {
            id: 2,
            image: "https://images.unsplash.com/photo-1503376763036-066120622c74?auto=format&fit=crop&q=80&w=1920",
            title: "QUALITY PARTS FOR EVERY VEHICLE",
            subtitle: "GENUINE PARTS • AFTERMARKET • ACCESSORIES",
            brands: false,
            titleColor: '#ffffff',
            titleSize: 'large',
            subtitleColor: '#ffffff',
            subtitleSize: 'medium',
            align: 'center'
        },
        {
            id: 3,
            image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1920",
            title: "NATIONWIDE DELIVERY",
            subtitle: "WE SHIP ANYWHERE IN THE PHILIPPINES",
            brands: false,
            titleColor: '#ffffff',
            titleSize: 'large',
            subtitleColor: '#ffffff',
            subtitleSize: 'medium',
            align: 'center'
        }
    ];

    const activeSlides = dbSlides.length > 0
        ? dbSlides.map(s => ({
            id: s.id,
            image: s.image_url,
            title: s.title,
            subtitle: s.subtitle,
            brands: false,
            // Styling props
            titleColor: s.title_color || '#ffffff',
            titleSize: s.title_size || 'large',
            subtitleColor: s.subtitle_color || '#ffffff',
            subtitleSize: s.subtitle_size || 'medium',
            align: s.text_align || 'center'
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
                            style={{ minWidth: "100%", flex: "0 0 100%" }}
                        >
                            <div className="relative w-full h-[600px] md:h-[950px] overflow-hidden bg-gray-900 group">
                                <div className="absolute inset-0 z-0 w-full h-full">
                                    {/* UPDATED: Changed object-cover to object-contain so full image is visible */}
                                    <ImageWithFallback
                                        src={slide.image}
                                        alt={slide.title || "Hero Image"}
                                        className="w-full h-full object-contain block"
                                        style={{ width: '100%', height: '100%', objectPosition: 'center' }}
                                    />
                                    <div className="absolute inset-0 bg-black/40 z-10"></div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 z-10"></div>
                                </div>

                                <div className={cn(
                                    "relative h-full container mx-auto px-4 flex flex-col justify-center z-20 pb-16",
                                    alignClasses[slide.align || 'center']
                                )}>
                                    {slide.title && (
                                        <h1
                                            className={cn(
                                                "font-black italic tracking-tighter mb-6 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] max-w-5xl leading-tight",
                                                titleSizes[slide.titleSize || 'large']
                                            )}
                                            style={{
                                                color: slide.titleColor,
                                                WebkitTextStroke: '2px black'
                                            }}
                                        >
                                            {slide.title}
                                        </h1>
                                    )}
                                    {slide.subtitle && (
                                        <p
                                            className={cn(
                                                "font-bold uppercase tracking-widest mb-10 text-white shadow-lg bg-blue-600/90 px-8 py-3 rounded-full backdrop-blur-md",
                                                subtitleSizes[slide.subtitleSize || 'medium']
                                            )}
                                            style={{
                                                color: slide.subtitleColor,
                                                WebkitTextStroke: '1px black'
                                            }}
                                        >
                                            {slide.subtitle}
                                        </p>
                                    )}

                                    <Button
                                        onClick={onShopNow}
                                        className="bg-white text-blue-900 hover:bg-gray-100 font-bold py-7 px-12 rounded-sm text-xl shadow-[0_10px_20px_rgba(0,0,0,0.5)] border-none transition-transform hover:scale-105 hover:-translate-y-1"
                                    >
                                        SHOP NOW
                                    </Button>

                                    {slide.brands && (
                                        <div className="mt-20 w-full overflow-hidden">
                                            <div className="flex justify-center flex-wrap gap-8 md:gap-16 opacity-90">
                                                {brandLogos.map(brand => (
                                                    <span
                                                        key={brand}
                                                        className="text-2xl md:text-3xl font-black text-white italic drop-shadow-lg"
                                                        style={{ WebkitTextStroke: '1px black' }}
                                                    >
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

                <div className="hidden md:block">
                    <CarouselPrevious className="absolute left-6 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white text-white hover:text-blue-900 border-white/20 h-14 w-14 rounded-full flex items-center justify-center cursor-pointer backdrop-blur-md transition-all hover:scale-110" />
                    <CarouselNext className="absolute right-6 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white text-white hover:text-blue-900 border-white/20 h-14 w-14 rounded-full flex items-center justify-center cursor-pointer backdrop-blur-md transition-all hover:scale-110" />
                </div>

                <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-30">
                    {activeSlides.map((_, index) => (
                        <button
                            key={index}
                            className={`h-3 rounded-full transition-all duration-300 shadow-sm ${
                                current === index + 1 ? "bg-white w-10" : "bg-white/40 w-3 hover:bg-white/80"
                            }`}
                            onClick={() => api?.scrollTo(index)}
                        />
                    ))}
                </div>
            </Carousel>

            <div className="bg-blue-600 text-white py-5 border-t border-blue-500 relative z-30 shadow-2xl">
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