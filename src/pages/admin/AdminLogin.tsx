import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent } from "../../components/ui/card";
import { toast } from "sonner";
import { Lock, ArrowRight } from "lucide-react";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        setLoading(false);

        if (error) {
            toast.error(error.message);
        } else {
            toast.success("Welcome back, Administrator.");
            navigate("/admin");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 p-4">
            <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-3 mb-6 bg-white p-2 rounded-xl shadow-lg">
                        <div className="bg-blue-600 text-white px-4 py-2 rounded font-bold text-xl">
                            AutoParts PH
                        </div>
                        <div className="h-6 w-px bg-gray-200"></div>
                        <span className="text-gray-600 font-medium pr-2">Admin</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                    <p className="text-blue-100 opacity-80">Sign in to the Admin Console</p>
                </div>

                <Card className="shadow-2xl border-none overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-400"></div>
                    <CardContent className="pt-8 px-8 pb-8">
                        <form onSubmit={handleLogin} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium text-lg rounded-lg shadow-lg shadow-blue-600/30 transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] mt-2 group"
                                disabled={loading}
                            >
                                {loading ? (
                                    "Signing in..."
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="mt-8 text-center">
                    <div className="inline-flex items-center gap-2 text-blue-200/60 text-xs">
                        <Lock className="w-3 h-3" />
                        <span>Secure Connection &bull; 256-bit Encryption</span>
                    </div>
                </div>
            </div>
        </div>
    );
}