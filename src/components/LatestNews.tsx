import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Calendar, User } from "lucide-react";

export function LatestNews() {
    const news = [
        {
            title: "How to check if your gas is contaminated",
            date: "Dec 28, 2025",
            author: "AutoParts PH",
            // Image: Mechanic / Oil check
            image: "https://images.unsplash.com/photo-1487754180477-db33d3808e29?auto=format&fit=crop&q=80&w=600"
        },
        {
            title: "One Of The Most Essential Car Accessories During Road Trips",
            date: "Dec 27, 2025",
            author: "AutoParts PH",
            // Image: Car Interior
            image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=600"
        },
        {
            title: "TOP 5 BEST CAR MOVIES OF ALL TIME",
            date: "Dec 26, 2025",
            author: "AutoParts PH",
            // Image: Car Action / Exterior
            image: "https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=600"
        }
    ];

    return (
        <section className="py-20 bg-white border-t border-gray-100">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-10 pb-4 border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900">Latest News</h2>
                    <a href="#" className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors uppercase tracking-wide flex items-center gap-1">
                        View all news
                    </a>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {news.map((item, i) => (
                        <div key={i} className="group cursor-pointer flex flex-col h-full">
                            <div className="aspect-video overflow-hidden rounded-sm mb-5 bg-gray-100 shadow-sm relative border border-gray-100">
                                <ImageWithFallback
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                />
                                <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/10 transition-colors duration-300"></div>
                            </div>

                            <div className="flex-1 flex flex-col">
                                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                                    <span className="flex items-center gap-1.5 font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-sm">
                                        <User className="w-3 h-3" />
                                        {item.author}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Calendar className="w-3 h-3" />
                                        {item.date}
                                    </span>
                                </div>

                                <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-3 leading-snug">
                                    {item.title}
                                </h3>

                                <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                                    Read more about {item.title.toLowerCase()} and discover expert tips from our automotive specialists.
                                </p>

                                <div className="mt-auto pt-4 border-t border-gray-100">
                                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-blue-600 transition-colors">Read Article</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}