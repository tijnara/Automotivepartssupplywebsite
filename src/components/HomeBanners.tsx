import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

export function HomeBanners() {
    return (
        <section className="py-8 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Parts & Accessories Banner */}
                    <div className="bg-white border border-gray-200 p-8 rounded-sm flex flex-col justify-center min-h-[250px] relative overflow-hidden group shadow-sm hover:shadow-md transition-all">
                        <div className="relative z-10 max-w-sm">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Parts & Accessories</h3>
                            <p className="text-gray-600 mb-6 text-sm">Check out our latest products for your accessories and parts needs.</p>
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-sm px-6 font-bold transition-all group-hover:translate-x-1">
                                Shop Parts & Accessories <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </div>
                        {/* Decorative Circle */}
                        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-blue-50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500 pointer-events-none"></div>
                    </div>

                    {/* Performance & Tools Banner */}
                    <div className="bg-white border border-gray-200 p-8 rounded-sm flex flex-col justify-center min-h-[250px] relative overflow-hidden group shadow-sm hover:shadow-md transition-all">
                        <div className="relative z-10 max-w-sm">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Performance & Tools</h3>
                            <p className="text-gray-600 mb-6 text-sm">Grab our best selling tools for your and other performance needs.</p>
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-sm px-6 font-bold transition-all group-hover:translate-x-1">
                                Shop Performance & Tools <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </div>
                        {/* Decorative Circle */}
                        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-blue-50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500 pointer-events-none"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}