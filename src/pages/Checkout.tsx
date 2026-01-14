import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { CartItem } from "../App";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { ChevronRight, CreditCard, Banknote, Truck, MapPin, Wallet, CheckCircle2, Circle } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

interface CheckoutProps {
    cartItems: CartItem[];
    onConfirmOrder: (orderData: any) => Promise<void>;
    // Props for Header
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    onRemoveItem: (id: number) => void;
    onUpdateQuantity: (id: number, delta: number) => void;
    onCheckout: () => void;
    onAddToCart: (product: any) => void;
}

export default function Checkout({
                                     cartItems,
                                     onConfirmOrder,
                                     searchQuery,
                                     setSearchQuery,
                                     onRemoveItem,
                                     onUpdateQuantity,
                                     onCheckout
                                 }: CheckoutProps) {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Form State
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [province, setProvince] = useState("");
    const [city, setCity] = useState("");
    const [address, setAddress] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [phone, setPhone] = useState("");
    const [shippingMethod, setShippingMethod] = useState("standard");
    const [paymentMethod, setPaymentMethod] = useState("cod");

    // Location Data State
    const [provinces, setProvinces] = useState<{ code: string; name: string }[]>([]);
    const [cities, setCities] = useState<{ code: string; name: string }[]>([]);
    const [loadingProvinces, setLoadingProvinces] = useState(true);
    const [loadingCities, setLoadingCities] = useState(false);

    // Fetch Provinces on Mount
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await fetch('https://psgc.gitlab.io/api/provinces/');
                if (!response.ok) throw new Error('Failed to fetch provinces');
                const data = await response.json();

                // Add Metro Manila manually with its Region Code (130000000)
                const provinceList = [
                    { code: "130000000", name: "Metro Manila" },
                    ...data.sort((a: any, b: any) => a.name.localeCompare(b.name))
                ];

                setProvinces(provinceList);
            } catch (error) {
                console.error("Error fetching provinces:", error);
            } finally {
                setLoadingProvinces(false);
            }
        };

        fetchProvinces();
    }, []);

    // Handle Province Change & Fetch Cities
    const handleProvinceChange = async (selectedProvinceName: string) => {
        setProvince(selectedProvinceName);
        setCity(""); // Reset city when province changes
        setCities([]); // Clear previous cities

        const selectedProv = provinces.find(p => p.name === selectedProvinceName);
        if (!selectedProv) return;

        setLoadingCities(true);
        try {
            // Determine endpoint: Metro Manila uses 'regions', others use 'provinces'
            const endpoint = selectedProv.name === "Metro Manila"
                ? `https://psgc.gitlab.io/api/regions/130000000/cities-municipalities/`
                : `https://psgc.gitlab.io/api/provinces/${selectedProv.code}/cities-municipalities/`;

            const response = await fetch(endpoint);
            if (!response.ok) throw new Error('Failed to fetch cities');
            const data = await response.json();

            // Sort cities alphabetically
            setCities(data.sort((a: any, b: any) => a.name.localeCompare(b.name)));
        } catch (error) {
            console.error("Error fetching cities:", error);
        } finally {
            setLoadingCities(false);
        }
    };

    // Handle Header Navigation (Home, Categories, All Products)
    const handleHeaderNavigation = (section: string) => {
        if (section === 'home') {
            navigate('/');
        } else if (section === 'categories') {
            navigate('/', { state: { scrollTo: 'categories' } });
        } else if (section === 'all-products') {
            navigate('/', { state: { scrollTo: 'featured-products' } });
        }
    };

    // Totals
    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = shippingMethod === "standard" ? 150 : 0;
    const total = subtotal + shipping;

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onConfirmOrder({
                customer_name: `${firstName} ${lastName}`,
                customer_email: email,
                customer_phone: phone,
                total_amount: total,
                shipping_address: `${address}, ${city}, ${province} ${postalCode}, Philippines`,
                // Send separate fields to be stored in the new DB columns
                shipping_province: province,
                shipping_city: city,
                shipping_method: shippingMethod,
                payment_method: paymentMethod,
                status: "pending"
            });
            navigate("/");
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Header
                    cartItems={cartItems}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onRemoveItem={onRemoveItem}
                    onUpdateQuantity={onUpdateQuantity}
                    onCheckout={onCheckout}
                    onNavigate={handleHeaderNavigation}
                />
                <main className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                        <Link to="/">
                            <Button>Return to Shop</Button>
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header
                cartItems={cartItems}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onRemoveItem={onRemoveItem}
                onUpdateQuantity={onUpdateQuantity}
                onCheckout={onCheckout}
                onNavigate={handleHeaderNavigation}
            />

            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="flex flex-col md:flex-row">

                        {/* LEFT COLUMN: Input Forms */}
                        <div className="flex-1 p-6 md:p-10 order-2 md:order-1 border-r border-gray-100">
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-8">
                                <Link to="/" className="hover:text-blue-600 transition cursor-pointer">Cart</Link>
                                <ChevronRight className="w-3 h-3" />
                                <span className="text-blue-900 font-semibold">Information</span>
                                <ChevronRight className="w-3 h-3" />
                                <span className="text-blue-900 font-semibold">Shipping</span>
                                <ChevronRight className="w-3 h-3" />
                                <span className="text-blue-900 font-semibold">Payment</span>
                            </div>

                            <form id="checkout-form" onSubmit={handleFormSubmit} className="space-y-10">

                                {/* Contact Section */}
                                <div className="space-y-6">
                                    <h3 className="font-semibold text-lg text-gray-900">Contact information</h3>
                                    <Input
                                        placeholder="Email or mobile phone number"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="bg-gray-50 border-gray-200 focus:bg-white transition-all h-12"
                                    />
                                </div>

                                {/* Delivery Section */}
                                <div className="space-y-6">
                                    <h3 className="font-semibold text-lg text-gray-900">Shipping address</h3>

                                    {/* Province Dropdown */}
                                    <Select
                                        value={province}
                                        onValueChange={handleProvinceChange}
                                        required
                                        disabled={loadingProvinces}
                                    >
                                        <SelectTrigger className="w-full bg-gray-50 border-gray-200 h-12">
                                            <SelectValue placeholder={loadingProvinces ? "Loading provinces..." : "Select Province"} />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-[300px]">
                                            {provinces.map((prov) => (
                                                <SelectItem key={prov.code} value={prov.name}>
                                                    {prov.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <div className="grid grid-cols-2 gap-6">
                                        <Input
                                            placeholder="First name"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            required
                                            className="bg-gray-50 border-gray-200 focus:bg-white transition-all h-12"
                                        />
                                        <Input
                                            placeholder="Last name"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            required
                                            className="bg-gray-50 border-gray-200 focus:bg-white transition-all h-12"
                                        />
                                    </div>

                                    <Input
                                        placeholder="Address"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        required
                                        className="bg-gray-50 border-gray-200 focus:bg-white transition-all h-12"
                                    />
                                    <Input
                                        placeholder="Apartment, suite, etc. (optional)"
                                        className="bg-gray-50 border-gray-200 focus:bg-white transition-all h-12"
                                    />

                                    <div className="grid grid-cols-2 gap-6">
                                        {/* City Dropdown */}
                                        <Select
                                            value={city}
                                            onValueChange={setCity}
                                            required
                                            disabled={!province || loadingCities}
                                        >
                                            <SelectTrigger className="w-full bg-gray-50 border-gray-200 h-12">
                                                <SelectValue placeholder={
                                                    !province ? "Select Province first" :
                                                        loadingCities ? "Loading cities..." :
                                                            "Select City / Municipality"
                                                } />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-[300px]">
                                                {cities.map((c) => (
                                                    <SelectItem key={c.code} value={c.name}>
                                                        {c.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        <Input
                                            placeholder="Postal code"
                                            value={postalCode}
                                            onChange={(e) => setPostalCode(e.target.value)}
                                            required
                                            className="bg-gray-50 border-gray-200 focus:bg-white transition-all h-12"
                                        />
                                    </div>

                                    <Input
                                        placeholder="Phone"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        required
                                        className="bg-gray-50 border-gray-200 focus:bg-white transition-all h-12"
                                    />
                                </div>

                                {/* Shipping Method */}
                                <div className="space-y-6 pt-8">
                                    <h3 className="font-semibold text-lg text-gray-900">Shipping method</h3>
                                    <RadioGroup value={shippingMethod} onValueChange={setShippingMethod} className="flex flex-col gap-4">

                                        {/* Standard Delivery Option */}
                                        <Label htmlFor="sm-standard" className="cursor-pointer">
                                            <div className={`
                                                relative border-2 rounded-xl p-5 flex items-center gap-5 transition-all duration-200 cursor-pointer
                                                ${shippingMethod === 'standard'
                                                ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                                                : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'}
                                            `}>
                                                <RadioGroupItem value="standard" id="sm-standard" className="sr-only" />

                                                <div className={`
                                                    p-3 rounded-full flex-shrink-0 transition-colors
                                                    ${shippingMethod === 'standard' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}
                                                `}>
                                                    <Truck className="w-6 h-6" />
                                                </div>

                                                <div className="flex-1">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className={`font-bold text-base ${shippingMethod === 'standard' ? 'text-blue-900' : 'text-gray-900'}`}>Standard Delivery</span>
                                                        <span className="font-bold text-gray-900">₱150.00</span>
                                                    </div>
                                                    <p className="text-sm text-gray-500">Fast and reliable shipping anywhere in PH.</p>
                                                </div>

                                                <div className={`transition-all duration-200 ${shippingMethod === 'standard' ? 'text-blue-600 scale-100 opacity-100' : 'text-gray-300 scale-90 opacity-50'}`}>
                                                    {shippingMethod === 'standard' ? <CheckCircle2 className="w-6 h-6 fill-blue-100" /> : <Circle className="w-6 h-6" />}
                                                </div>
                                            </div>
                                        </Label>

                                        {/* Walk-in Option */}
                                        <Label htmlFor="sm-walkin" className="cursor-pointer">
                                            <div className={`
                                                relative border-2 rounded-xl p-5 flex items-center gap-5 transition-all duration-200 cursor-pointer
                                                ${shippingMethod === 'walkin'
                                                ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                                                : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'}
                                            `}>
                                                <RadioGroupItem value="walkin" id="sm-walkin" className="sr-only" />

                                                <div className={`
                                                    p-3 rounded-full flex-shrink-0 transition-colors
                                                    ${shippingMethod === 'walkin' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}
                                                `}>
                                                    <MapPin className="w-6 h-6" />
                                                </div>

                                                <div className="flex-1">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className={`font-bold text-base ${shippingMethod === 'walkin' ? 'text-blue-900' : 'text-gray-900'}`}>Walk-in / Pickup</span>
                                                        <span className="font-bold text-green-600">Free</span>
                                                    </div>
                                                    <p className="text-sm text-gray-500">Pick up your order at our nearest store.</p>
                                                </div>

                                                <div className={`transition-all duration-200 ${shippingMethod === 'walkin' ? 'text-blue-600 scale-100 opacity-100' : 'text-gray-300 scale-90 opacity-50'}`}>
                                                    {shippingMethod === 'walkin' ? <CheckCircle2 className="w-6 h-6 fill-blue-100" /> : <Circle className="w-6 h-6" />}
                                                </div>
                                            </div>
                                        </Label>

                                    </RadioGroup>
                                </div>

                                {/* Payment Method */}
                                <div className="space-y-6 pt-8">
                                    <h3 className="font-semibold text-lg text-gray-900">Payment</h3>
                                    <p className="text-sm text-gray-500 mb-3">All transactions are secure and encrypted.</p>
                                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="flex flex-col gap-4">

                                        {/* Card Payment */}
                                        <Label htmlFor="pm-card" className="cursor-pointer">
                                            <div className={`
                                                relative border-2 rounded-xl p-5 flex items-center gap-5 transition-all duration-200 cursor-pointer
                                                ${paymentMethod === 'card'
                                                ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                                                : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'}
                                            `}>
                                                <RadioGroupItem value="card" id="pm-card" className="sr-only" />

                                                <div className={`
                                                    p-3 rounded-full flex-shrink-0 transition-colors
                                                    ${paymentMethod === 'card' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}
                                                `}>
                                                    <CreditCard className="w-6 h-6" />
                                                </div>

                                                <div className="flex-1">
                                                    <span className={`font-bold text-base block mb-1 ${paymentMethod === 'card' ? 'text-blue-900' : 'text-gray-900'}`}>
                                                        Credit/Debit Card via PayMongo
                                                    </span>
                                                    <p className="text-sm text-gray-500">Secure online payment.</p>
                                                </div>

                                                <div className={`transition-all duration-200 ${paymentMethod === 'card' ? 'text-blue-600 scale-100 opacity-100' : 'text-gray-300 scale-90 opacity-50'}`}>
                                                    {paymentMethod === 'card' ? <CheckCircle2 className="w-6 h-6 fill-blue-100" /> : <Circle className="w-6 h-6" />}
                                                </div>
                                            </div>
                                        </Label>

                                        {/* COD Payment */}
                                        <Label htmlFor="pm-cod" className="cursor-pointer">
                                            <div className={`
                                                relative border-2 rounded-xl p-5 flex items-center gap-5 transition-all duration-200 cursor-pointer
                                                ${paymentMethod === 'cod'
                                                ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                                                : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'}
                                            `}>
                                                <RadioGroupItem value="cod" id="pm-cod" className="sr-only" />

                                                <div className={`
                                                    p-3 rounded-full flex-shrink-0 transition-colors
                                                    ${paymentMethod === 'cod' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}
                                                `}>
                                                    <Banknote className="w-6 h-6" />
                                                </div>

                                                <div className="flex-1">
                                                    <span className={`font-bold text-base block mb-1 ${paymentMethod === 'cod' ? 'text-blue-900' : 'text-gray-900'}`}>
                                                        Cash on Delivery (COD)
                                                    </span>
                                                    <p className="text-sm text-gray-500">Pay when your order arrives.</p>
                                                </div>

                                                <div className={`transition-all duration-200 ${paymentMethod === 'cod' ? 'text-blue-600 scale-100 opacity-100' : 'text-gray-300 scale-90 opacity-50'}`}>
                                                    {paymentMethod === 'cod' ? <CheckCircle2 className="w-6 h-6 fill-blue-100" /> : <Circle className="w-6 h-6" />}
                                                </div>
                                            </div>
                                        </Label>

                                        {/* Cash Payment */}
                                        <Label htmlFor="pm-cash" className="cursor-pointer">
                                            <div className={`
                                                relative border-2 rounded-xl p-5 flex items-center gap-5 transition-all duration-200 cursor-pointer
                                                ${paymentMethod === 'cash'
                                                ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                                                : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'}
                                            `}>
                                                <RadioGroupItem value="cash" id="pm-cash" className="sr-only" />

                                                <div className={`
                                                    p-3 rounded-full flex-shrink-0 transition-colors
                                                    ${paymentMethod === 'cash' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}
                                                `}>
                                                    <Wallet className="w-6 h-6" />
                                                </div>

                                                <div className="flex-1">
                                                    <span className={`font-bold text-base block mb-1 ${paymentMethod === 'cash' ? 'text-blue-900' : 'text-gray-900'}`}>
                                                        Cash
                                                    </span>
                                                    <p className="text-sm text-gray-500">Pay at the store counter.</p>
                                                </div>

                                                <div className={`transition-all duration-200 ${paymentMethod === 'cash' ? 'text-blue-600 scale-100 opacity-100' : 'text-gray-300 scale-90 opacity-50'}`}>
                                                    {paymentMethod === 'cash' ? <CheckCircle2 className="w-6 h-6 fill-blue-100" /> : <Circle className="w-6 h-6" />}
                                                </div>
                                            </div>
                                        </Label>

                                    </RadioGroup>
                                </div>

                                <div className="flex justify-end pt-20">
                                    <Button
                                        type="submit"
                                        className="w-full sm:w-auto h-12 px-8 text-base bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20"
                                        disabled={loading}
                                    >
                                        {loading ? "Processing..." : "Complete Order"}
                                    </Button>
                                </div>

                            </form>
                        </div>

                        {/* RIGHT COLUMN: Order Summary */}
                        <div className="w-full md:w-[420px] bg-gray-50/80 p-6 md:p-10 order-1 md:order-2">
                            <div className="space-y-4">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4">
                                        <div className="relative w-16 h-16 border border-gray-200 bg-white rounded-lg flex-shrink-0 overflow-hidden">
                                            <ImageWithFallback
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                            <span className="absolute -top-2 -right-2 bg-gray-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
                                            <p className="text-xs text-gray-500">{item.category}</p>
                                        </div>
                                        <div className="text-sm font-medium text-gray-900">
                                            ₱{(item.price * item.quantity).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Separator className="my-8" />

                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium text-gray-900">₱{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-medium text-gray-900">₱{shipping.toLocaleString()}</span>
                                </div>
                            </div>

                            <Separator className="my-8" />

                            <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold text-gray-900">Total</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-sm text-gray-500">PHP</span>
                                    <span className="text-2xl font-bold text-gray-900">₱{total.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}