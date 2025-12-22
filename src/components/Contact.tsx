import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { supabase } from "../lib/supabase"; // Import Supabase client

export function Contact() {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string;
        const message = formData.get('message') as string;

        try {
            // Insert into Supabase table
            const { error } = await supabase
                .from('contact_messages')
                .insert([{ name, email, phone, message }]);

            if (error) throw error;

            toast.success("Message sent successfully!");
            form.reset();
        } catch (error: any) {
            console.error('Error submitting form:', error);
            toast.error("Failed to send message. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="contact" className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-12">
                    <div>
                        <h2 className="mb-4">Get in Touch</h2>
                        <p className="text-gray-600 mb-8">
                            Have questions about our products? Need help finding a specific part?
                            Contact us and we{'\u2019'}ll be happy to assist you.
                        </p>

                        <div className="space-y-6">
                            {/* ... info section remains the same ... */}
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
                            {/* ... phone, email, clock items ... */}
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
                                    name="name"
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
                                    name="email"
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
                                    name="phone"
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
                                    name="message"
                                    rows={4}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    placeholder="How can we help you?"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition disabled:opacity-50"
                            >
                                {loading ? "Sending..." : "Send Message"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}