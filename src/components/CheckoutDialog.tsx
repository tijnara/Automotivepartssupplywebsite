import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { CartItem } from "../App";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ChevronRight, CreditCard, Banknote, Truck } from "lucide-react";

interface CheckoutDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    cartItems: CartItem[];
    onConfirmOrder: (orderData: any) => Promise<void>;
}

export function CheckoutDialog({ open, onOpenChange, cartItems, onConfirmOrder }: CheckoutDialogProps) {
    const [loading, setLoading] = useState(false);
    const [step] = useState<"info" | "shipping" | "payment">("info");

    // Form State
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [address, setAddress] = useState("");
    const [apartment, setApartment] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [phone, setPhone] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("cod");

    // Totals
    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = 150; // Hardcoded standard shipping
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
                shipping_address: `${address}${apartment ? `, ${apartment}` : ""}, ${city} ${postalCode}`
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
            <DialogContent className="sm:max-w-4xl p-0 bg-white gap-0 h-[90vh] md:h-auto md:max-h-[85vh]">
                <DialogHeader className="sr-only">
                    <DialogTitle>Checkout</DialogTitle>
                    <DialogDescription>
                        Please provide your shipping and payment information to complete the order.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col md:flex-row min-h-0 h-full">

                    {/* LEFT COLUMN: Input Forms */}
                    <div className="flex-1 p-6 md:p-8 overflow-y-auto order-2 md:order-1">
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
                            <span className={step === "info" ? "text-blue-600 font-medium" : ""}>Information</span>
                            <ChevronRight className="w-3 h-3" />
                            <span className={step === "shipping" ? "text-blue-600 font-medium" : ""}>Shipping</span>
                            <ChevronRight className="w-3 h-3" />
                            <span className={step === "payment" ? "text-blue-600 font-medium" : ""}>Payment</span>
                        </div>

                        <form id="checkout-form" onSubmit={handleFormSubmit} className="space-y-6">

                            {/* Contact Section */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-semibold text-lg">Contact</h3>
                                    <button type="button" className="text-blue-600 text-sm hover:underline">Log in</button>
                                </div>
                                <Input
                                    placeholder="Email or mobile phone number"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" id="newsletter" className="rounded border-gray-300" />
                                    <Label htmlFor="newsletter" className="text-sm font-normal text-gray-600">Email me with news and offers</Label>
                                </div>
                            </div>

                            {/* Delivery Section */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg">Delivery</h3>
                                <Select defaultValue="PH">
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Country/Region" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PH">Philippines</SelectItem>
                                    </SelectContent>
                                </Select>

                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        placeholder="First name"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                    />
                                    <Input
                                        placeholder="Last name"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                    />
                                </div>

                                <Input
                                    placeholder="Address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                />
                                <Input 
                                    placeholder="Apartment, suite, etc. (optional)" 
                                    value={apartment}
                                    onChange={(e) => setApartment(e.target.value)}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        placeholder="City"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        required
                                    />
                                    <Input
                                        placeholder="Postal code"
                                        value={postalCode}
                                        onChange={(e) => setPostalCode(e.target.value)}
                                        required
                                    />
                                </div>

                                <Input
                                    placeholder="Phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Shipping Method (Simplified) */}
                            <div className="space-y-4 pt-4">
                                <h3 className="font-semibold text-lg">Shipping method</h3>
                                <div className="border rounded-lg p-4 flex justify-between items-center bg-blue-50/50 border-blue-200">
                                    <div className="flex items-center gap-3">
                                        <Truck className="w-5 h-5 text-blue-600" />
                                        <span className="text-sm font-medium">Standard Delivery</span>
                                    </div>
                                    <span className="font-bold text-sm">₱150.00</span>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="space-y-4 pt-4">
                                <h3 className="font-semibold text-lg">Payment</h3>
                                <p className="text-sm text-gray-500 mb-3">All transactions are secure and encrypted.</p>
                                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="flex flex-col gap-3">
                                    <div className={`border rounded-lg p-4 flex items-center gap-3 cursor-pointer ${paymentMethod === 'card' ? 'border-blue-600 ring-1 ring-blue-600 bg-blue-50/30' : ''}`}>
                                        <RadioGroupItem value="card" id="pm-card" />
                                        <Label htmlFor="pm-card" className="flex-1 cursor-pointer font-medium flex items-center gap-2">
                                            Credit/Debit Card via PayMongo <CreditCard className="w-4 h-4 text-gray-500" />
                                        </Label>
                                    </div>
                                    <div className={`border rounded-lg p-4 flex items-center gap-3 cursor-pointer ${paymentMethod === 'cod' ? 'border-blue-600 ring-1 ring-blue-600 bg-blue-50/30' : ''}`}>
                                        <RadioGroupItem value="cod" id="pm-cod" />
                                        <Label htmlFor="pm-cod" className="flex-1 cursor-pointer font-medium flex items-center gap-2">
                                            Cash on Delivery (COD) <Banknote className="w-4 h-4 text-gray-500" />
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700 mt-6"
                                disabled={loading}
                            >
                                {loading ? "Processing..." : `Pay ₱${total.toLocaleString()}`}
                            </Button>

                        </form>
                    </div>

                    {/* RIGHT COLUMN: Order Summary */}
                    <div className="w-full md:w-[400px] bg-gray-50 border-l border-gray-200 p-6 md:p-8 order-1 md:order-2">
                        <div className="space-y-6">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex items-center gap-4">
                                    <div className="relative w-16 h-16 border bg-white rounded-md flex-shrink-0">
                                        <ImageWithFallback
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover rounded-md"
                                        />
                                        <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
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

                        <Separator className="my-6" />

                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-medium">₱{subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Shipping</span>
                                <span className="font-medium">₱{shipping.toLocaleString()}</span>
                            </div>
                        </div>

                        <Separator className="my-6" />

                        <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-gray-900">Total</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-xs text-gray-500">PHP</span>
                                <span className="text-2xl font-bold text-gray-900">₱{total.toLocaleString()}</span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Including ₱{(total * 0.12).toLocaleString(undefined, {maximumFractionDigits:2})} in taxes</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}