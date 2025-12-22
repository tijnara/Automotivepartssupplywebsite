import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { FormEvent } from "react";
import { toast } from "sonner";

export function Contact() {
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        // In a real app, you would send data to a backend here
        toast.success("Message sent! We'll get back to you shortly.");
        (e.target as HTMLFormElement).reset();
    };

    return (
        <section id="contact" className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                {/* ... (Left side content remains the same) ... */}
                <div className="grid md:grid-cols-2 gap-12">
                    <div>
                        <h2 className="mb-4">Get in Touch</h2>
                        <p className="text-gray-600 mb-8">
                            Have questions about our products? Need help finding a specific part?
                            Contact us and we{'\u2019'}ll be happy to assist you.
                        </p>

                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <div>Address</div>
                                    <p className="text-gray-600">
                                        123 Automotive Street, Quezon City<br />
                                        Metro Manila, Philippines 1100
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Phone className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <div>Phone</div>
                                    <p className="text-gray-600">
                                        +63 917 123 4567<br />
                                        +63 2 8123 4567
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Mail className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <div>Email</div>
                                    <p className="text-gray-600">
                                        sales@autopartsph.com<br />
                                        support@autopartsph.com
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Clock className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <div>Business Hours</div>
                                    <p className="text-gray-600">
                                        Monday - Saturday: 8:00 AM - 6:00 PM<br />
                                        Sunday: Closed
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-sm">
                            <h3 className="mb-6">Send us a Message</h3>

                            <div className="mb-4">
                                <label htmlFor="name" className="block mb-2">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    placeholder="Your name"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="email" className="block mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    placeholder="your.email@example.com"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="phone" className="block mb-2">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    placeholder="+63 912 345 6789"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="message" className="block mb-2">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    rows={4}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    placeholder="How can we help you?"
                                />
                            </div>

                            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition">
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}