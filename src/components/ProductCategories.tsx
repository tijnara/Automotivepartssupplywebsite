import { 
  Car, 
  Cog, 
  Battery, 
  CircleDot, 
  Gauge, 
  Lightbulb, 
  Wind, 
  Wrench 
} from "lucide-react";

const categories = [
  { icon: Cog, name: "Engine Parts", count: "2,500+" },
  { icon: CircleDot, name: "Brake System", count: "1,800+" },
  { icon: Battery, name: "Electrical", count: "1,200+" },
  { icon: Wind, name: "Suspension", count: "950+" },
  { icon: Gauge, name: "Transmission", count: "870+" },
  { icon: Lightbulb, name: "Lighting", count: "650+" },
  { icon: Wrench, name: "Tools", count: "800+" },
  { icon: Car, name: "Body Parts", count: "1,400+" },
];

export function ProductCategories() {
  return (
    <section id="products" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="mb-4">Browse by Category</h2>
          <p className="text-gray-600">
            Find the right parts for your vehicle from our extensive inventory
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.name}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition text-center group"
              >
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 transition">
                  <Icon className="w-8 h-8 text-blue-600 group-hover:text-white transition" />
                </div>
                <h3 className="mb-2">{category.name}</h3>
                <p className="text-gray-600">{category.count} items</p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
