import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { CartItem } from "../App";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { ChevronRight, CreditCard, Banknote, Truck, MapPin, Wallet } from "lucide-react";
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
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [phone, setPhone] = useState("");
    const [shippingMethod, setShippingMethod] = useState("standard");
    const [paymentMethod, setPaymentMethod] = useState("cod");

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
                shipping_address: `${address}, ${city} ${postalCode}`,
                shipping_method: shippingMethod,
                payment_method: paymentMethod,
                status: "pending"
            });
            // Redirect to home or success page after order
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
            />

            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="flex flex-col md:flex-row">

                        {/* LEFT COLUMN: Input Forms */}
                        <div className="flex-1 p-6 md:p-10 order-2 md:order-1 border-r border-gray-100">
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-8">
                                <Link to="/" className="hover:text-blue-600 transition">Cart</Link>
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
                                    <Select defaultValue="PH">
                                        <SelectTrigger className="w-full bg-gray-50 border-gray-200 h-12">
                                            <SelectValue placeholder="Country/Region" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PH">Philippines</SelectItem>
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
                                        <Input
                                            placeholder="City"
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            required
                                            className="bg-gray-50 border-gray-200 focus:bg-white transition-all h-12"
                                        />
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
                                    <RadioGroup value={shippingMethod} onValueChange={setShippingMethod} className="flex flex-col gap-6">
                                        <div className={`border rounded-lg p-5 flex items-center gap-5 cursor-pointer transition-all ${shippingMethod === 'standard' ? 'border-blue-600 ring-1 ring-blue-600 bg-blue-50/20' : 'hover:bg-gray-50'}`}>
                                            <RadioGroupItem value="standard" id="sm-standard" />
                                            <Label htmlFor="sm-standard" className="flex-1 cursor-pointer font-medium flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="bg-white p-2 rounded-full shadow-sm border border-gray-100">
                                                        <Truck className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                    <span>Standard Delivery</span>
                                                </div>
                                                <span className="font-bold">₱150.00</span>
                                            </Label>
                                        </div>
                                        <div className={`border rounded-lg p-5 flex items-center gap-5 cursor-pointer transition-all ${shippingMethod === 'walkin' ? 'border-blue-600 ring-1 ring-blue-600 bg-blue-50/20' : 'hover:bg-gray-50'}`}>
                                            <RadioGroupItem value="walkin" id="sm-walkin" />
                                            <Label htmlFor="sm-walkin" className="flex-1 cursor-pointer font-medium flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="bg-white p-2 rounded-full shadow-sm border border-gray-100">
                                                        <MapPin className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                    <span>Walk-in</span>
                                                </div>
                                                <span className="font-bold text-green-600">Free</span>
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                {/* Payment Method */}
                                <div className="space-y-6 pt-8">
                                    <h3 className="font-semibold text-lg text-gray-900">Payment</h3>
                                    <p className="text-sm text-gray-500 mb-3">All transactions are secure and encrypted.</p>
                                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="flex flex-col gap-6">
                                        <div className={`border rounded-lg p-5 flex items-center gap-5 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-blue-600 ring-1 ring-blue-600 bg-blue-50/20' : 'hover:bg-gray-50'}`}>
                                            <RadioGroupItem value="card" id="pm-card" />
                                            <Label htmlFor="pm-card" className="flex-1 cursor-pointer font-medium flex items-center justify-between">
                                                <span>Credit/Debit Card via PayMongo</span>
                                                <CreditCard className="w-5 h-5 text-gray-500" />
                                            </Label>
                                        </div>
                                        <div className={`border rounded-lg p-5 flex items-center gap-5 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-blue-600 ring-1 ring-blue-600 bg-blue-50/20' : 'hover:bg-gray-50'}`}>
                                            <RadioGroupItem value="cod" id="pm-cod" />
                                            <Label htmlFor="pm-cod" className="flex-1 cursor-pointer font-medium flex items-center justify-between">
                                                <span>Cash on Delivery (COD)</span>
                                                <Banknote className="w-5 h-5 text-gray-500" />
                                            </Label>
                                        </div>
                                        <div className={`border rounded-lg p-5 flex items-center gap-5 cursor-pointer transition-all ${paymentMethod === 'cash' ? 'border-blue-600 ring-1 ring-blue-600 bg-blue-50/20' : 'hover:bg-gray-50'}`}>
                                            <RadioGroupItem value="cash" id="pm-cash" />
                                            <Label htmlFor="pm-cash" className="flex-1 cursor-pointer font-medium flex items-center justify-between">
                                                <span>Cash</span>
                                                <Wallet className="w-5 h-5 text-gray-500" />
                                            </Label>
                                        </div>
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