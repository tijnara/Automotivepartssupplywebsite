import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Database } from "../../types/database.types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Mail, Phone, MessageSquare, Clock, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { Button } from "../../components/ui/button";

type Message = Database['public']['Tables']['contact_messages']['Row'];

export default function AdminMessages() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('contact_messages')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) toast.error("Failed to load messages");
        else setMessages(data || []);
        setLoading(false);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this message?")) return;

        const { error } = await supabase
            .from('contact_messages')
            .delete()
            .eq('id', id);
        
        if (error) {
            toast.error("Error deleting message");
        } else {
            toast.success("Message deleted");
            setMessages(messages.filter(m => m.id !== id));
        }
    };

    return (
        <AdminLayout 
            title="Messages" 
            description="View and manage customer inquiries from the contact form."
        >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <Table className="border-collapse border border-gray-200">
                    <TableHeader className="bg-gray-50/80 border-b border-gray-200">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="py-4 text-center border border-gray-200 font-bold text-gray-700">Customer</TableHead>
                            <TableHead className="py-4 text-center border border-gray-200 font-bold text-gray-700">Contact Info</TableHead>
                            <TableHead className="py-4 w-[40%] text-center border border-gray-200 font-bold text-gray-700">Message</TableHead>
                            <TableHead className="py-4 text-center border border-gray-200 font-bold text-gray-700">Date</TableHead>
                            <TableHead className="py-4 text-center border border-gray-200 font-bold text-gray-700">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-20 border border-gray-200">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-gray-500 font-medium">Loading messages...</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : messages.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-16 text-gray-500 border border-gray-200">
                                    <div className="flex flex-col items-center justify-center gap-3">
                                        <Mail className="w-12 h-12 text-gray-200" />
                                        <p>No messages received yet.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            messages.map((msg) => (
                                <TableRow key={msg.id} className="group hover:bg-blue-50/30 transition-colors border-b border-gray-200">
                                    <TableCell className="py-4 text-center border border-gray-200">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                                {msg.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-semibold text-gray-900">{msg.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center border border-gray-200">
                                        <div className="flex flex-col items-center gap-1 text-sm">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Mail className="w-3 h-3" />
                                                {msg.email}
                                            </div>
                                            {msg.phone && (
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Phone className="w-3 h-3" />
                                                    {msg.phone}
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4 text-center border border-gray-200">
                                        <div className="flex justify-center gap-2">
                                            <MessageSquare className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                                            <p className="text-gray-700 text-sm leading-relaxed italic text-left max-w-md">
                                                "{msg.message}"
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center border border-gray-200">
                                        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                                            <Clock className="w-3 h-3" />
                                            {new Date(msg.created_at).toLocaleDateString()}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center border border-gray-200">
                                        <div className="flex justify-center">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                onClick={() => handleDelete(msg.id)}
                                                title="Delete Message"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </AdminLayout>
    );
}
