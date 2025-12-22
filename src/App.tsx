import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { ProductCategories } from "./components/ProductCategories";
import { FeaturedProducts } from "./components/FeaturedProducts";
import { WhyChooseUs } from "./components/WhyChooseUs";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <ProductCategories />
        <FeaturedProducts />
        <WhyChooseUs />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
