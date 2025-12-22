import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Database } from "../../types/database.types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { ShoppingBag, User, Mail, Phone, Calendar, CheckCircle2, Clock, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { Button } from "../../components/ui/button";

type Order = Database['public']['Tables']['orders']['Row'];

export default function AdminOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) toast.error("Failed to load orders");
        else setOrders(data || []);
        setLoading(false);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this order?")) return;

        const { error } = await supabase
            .from('orders')
            .delete()
            .eq('id', id);
        
        if (error) {
            toast.error("Error deleting order");
        } else {
            toast.success("Order deleted");
            setOrders(orders.filter(o => o.id !== id));
        }
    };

    const updateStatus = async (id: number, status: string) => {
        const { error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', id);
        
        if (error) {
            toast.error("Failed to update status");
        } else {
            toast.success(`Order marked as ${status}`);
            setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
        }
    };

    return (
        <AdminLayout 
            title="Orders" 
            description="Manage customer orders and track fulfillment status."
        >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50/80 border-b border-gray-100">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="py-4 pl-6">Order ID</TableHead>
                            <TableHead className="py-4">Customer</TableHead>
                            <TableHead className="py-4">Total Amount</TableHead>
                            <TableHead className="py-4">Status</TableHead>
                            <TableHead className="py-4">Date</TableHead>
                            <TableHead className="text-right py-4 pr-6">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-20">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-gray-500 font-medium">Loading orders...</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-16 text-gray-500">
                                    <div className="flex flex-col items-center justify-center gap-3">
                                        <ShoppingBag className="w-12 h-12 text-gray-200" />
                                        <p>No orders placed yet.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            orders.map((order) => (
                                <TableRow key={order.id} className="group hover:bg-blue-50/30 transition-colors border-b border-gray-50 last:border-none">
                                    <TableCell className="py-4 pl-6">
                                        <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                            #{order.id.toString().padStart(4, '0')}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-gray-900">{order.customer_name}</span>
                                            <span className="text-xs text-gray-500">{order.customer_email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-bold text-gray-900">
                                        ₱{Number(order.total_amount).toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                                            order.status === 'completed' 
                                                ? 'bg-green-50 text-green-700 border-green-100' 
                                                : 'bg-yellow-50 text-yellow-700 border-yellow-100'
                                        }`}>
                                            {order.status === 'completed' ? (
                                                <CheckCircle2 className="w-3 h-3" />
                                            ) : (
                                                <Clock className="w-3 h-3" />
                                            )}
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <div className="flex justify-end gap-2">
                                            {order.status !== 'completed' && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                    onClick={() => updateStatus(order.id, 'completed')}
                                                    title="Mark as Completed"
                                                >
                                                    <CheckCircle2 className="w-4 h-4" />
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                onClick={() => handleDelete(order.id)}
                                                title="Delete Order"
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
