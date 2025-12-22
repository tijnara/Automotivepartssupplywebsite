import { Shield, Truck, ThumbsUp, Clock } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Genuine & Quality Parts",
    description: "We only supply authentic and high-quality automotive parts from trusted manufacturers."
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Nationwide shipping across the Philippines. Metro Manila same-day delivery available."
  },
  {
    icon: ThumbsUp,
    title: "Expert Support",
    description: "Our team of automotive specialists is ready to help you find the right parts."
  },
  {
    icon: Clock,
    title: "Quick Processing",
    description: "Orders are processed quickly with most items ready for dispatch within 24 hours."
  },
];

export function WhyChooseUs() {
  return (
    <section id="about" className="py-16 bg-blue-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="mb-4">Why Choose AutoParts PH?</h2>
          <p className="text-blue-200">
            Your reliable partner for automotive parts and accessories
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="text-center">
                <div className="bg-blue-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="mb-3">{feature.title}</h3>
                <p className="text-blue-200">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
