import { ImageWithFallback } from "./figma/ImageWithFallback";

export function LatestNews() {
    const news = [
        {
            title: "How to check if your gas is contaminated",
            date: "Dec 28, 2025",
            image: "https://images.unsplash.com/photo-1632823471565-1ec2fae3302b?auto=format&fit=crop&q=80&w=600"
        },
        {
            title: "One Of The Most Essential Car Accessories During Road Trips",
            date: "Dec 27, 2025",
            image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=600"
        },
        {
            title: "TOP 5 BEST CAR MOVIES OF ALL TIME",
            date: "Dec 26, 2025",
            image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=600"
        }
    ];

    return (
        <section className="py-16 bg-white border-t border-gray-100">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-bold text-gray-900">Latest News</h2>
                    <a href="#" className="text-sm font-bold text-gray-900 hover:text-blue-600 transition-colors">View all</a>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {news.map((item, i) => (
                        <div key={i} className="group cursor-pointer">
                            <div className="aspect-video overflow-hidden rounded-sm mb-4 bg-gray-100">
                                <ImageWithFallback
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2 leading-tight">
                                {item.title}
                            </h3>
                            <div className="text-xs text-gray-500 flex gap-2 items-center">
                                <span className="font-semibold text-blue-600">AutoParts PH</span>
                                <span className="text-gray-300">•</span>
                                <span>{item.date}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}