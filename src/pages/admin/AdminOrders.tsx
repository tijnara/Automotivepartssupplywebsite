import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Database } from "../../types/database.types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { ShoppingBag, Calendar, CheckCircle2, Clock, Trash2, Eye, CreditCard, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { Button } from "../../components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "../../components/ui/dialog";
import { Badge } from "../../components/ui/badge";
import { ScrollArea } from "../../components/ui/scroll-area";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

type Order = Database['public']['Tables']['orders']['Row'];

// Define a type for Order Items joined with Product details
type OrderItemDetail = {
    id: number;
    quantity: number;
    price_at_purchase: number;
    products: {
        name: string;
        image: string;
        category: string;
    } | null;
};

export default function AdminOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    // State for viewing order details
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [orderItems, setOrderItems] = useState<OrderItemDetail[]>([]);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

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

    const fetchOrderDetails = async (order: Order) => {
        setSelectedOrder(order);
        setLoadingDetails(true);
        setIsDialogOpen(true);

        // Fetch items and join with products table to get names/images
        const { data, error } = await supabase
            .from('order_items')
            .select(`
                id,
                quantity,
                price_at_purchase,
                products (
                    name,
                    image,
                    category
                )
            `)
            .eq('order_id', order.id);

        if (error) {
            console.error(error);
            toast.error("Failed to load order details");
        } else {
            // Cast data safely as the join returns an array structure
            setOrderItems((data as any) || []);
        }
        setLoadingDetails(false);
    };

    const handleDelete = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent row click
        if (!confirm("Are you sure you want to delete this order?")) return;

        const { error } = await supabase
            .from('orders')
            .delete()
            .eq('id', id);

        if (error) {
            toast.error("Error deleting order");
        } else {
            toast.success("Order deleted");
            setOrders(prev => prev.filter(o => o.id !== id));
            if (selectedOrder?.id === id) setIsDialogOpen(false);
        }
    };

    const updateStatus = async (id: number, status: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();

        const { error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', id);

        if (error) {
            toast.error("Failed to update status");
        } else {
            toast.success(`Order marked as ${status}`);
            setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));

            // Update local state if currently viewing this order
            if (selectedOrder?.id === id) {
                setSelectedOrder(prev => prev ? { ...prev, status } : null);
            }
        }
    };

    const updatePaymentStatus = async (id: number, payment_status: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();

        const { error } = await supabase
            .from('orders')
            .update({ payment_status })
            .eq('id', id);

        if (error) {
            toast.error("Failed to update payment status");
        } else {
            toast.success(`Payment marked as ${payment_status}`);
            setOrders(prev => prev.map(o => o.id === id ? { ...o, payment_status } : o));

            // Update local state if currently viewing this order
            if (selectedOrder?.id === id) {
                setSelectedOrder(prev => prev ? { ...prev, payment_status } : null);
            }
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
                            <TableHead className="py-4 pl-6 w-[100px]">Order ID</TableHead>
                            <TableHead className="py-4">Customer</TableHead>
                            <TableHead className="py-4">Total Amount</TableHead>
                            <TableHead className="py-4">Payment</TableHead>
                            <TableHead className="py-4">Status</TableHead>
                            <TableHead className="py-4">Date</TableHead>
                            <TableHead className="text-right py-4 pr-6">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-20">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-gray-500 font-medium">Loading orders...</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-16 text-gray-500">
                                    <div className="flex flex-col items-center justify-center gap-3">
                                        <ShoppingBag className="w-12 h-12 text-gray-200" />
                                        <p>No orders placed yet.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            orders.map((order) => (
                                <TableRow
                                    key={order.id}
                                    className="group hover:bg-blue-50/30 transition-colors border-b border-gray-50 last:border-none cursor-pointer"
                                    onClick={() => fetchOrderDetails(order)}
                                >
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
                                        <Badge variant={order.payment_status === 'verified' ? 'secondary' : 'outline'} className={
                                            order.payment_status === 'verified'
                                                ? 'bg-blue-100 text-blue-700 hover:bg-blue-100 border-transparent'
                                                : 'bg-gray-100 text-gray-700 border-gray-200'
                                        }>
                                            {order.payment_status === 'verified' ? (
                                                <ShieldCheck className="w-3 h-3 mr-1" />
                                            ) : (
                                                <CreditCard className="w-3 h-3 mr-1" />
                                            )}
                                            <span className="capitalize">{order.payment_status || 'pending'}</span>
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={order.status === 'completed' ? 'secondary' : 'outline'} className={
                                            order.status === 'completed'
                                                ? 'bg-green-100 text-green-700 hover:bg-green-100 border-transparent'
                                                : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                        }>
                                            {order.status === 'completed' ? (
                                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                            ) : (
                                                <Clock className="w-3 h-3 mr-1" />
                                            )}
                                            <span className="capitalize">{order.status}</span>
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                onClick={(e) => { e.stopPropagation(); fetchOrderDetails(order); }}
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Button>

                                            {order.payment_status !== 'verified' && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                    onClick={(e) => updatePaymentStatus(order.id, 'verified', e)}
                                                    title="Verify Payment"
                                                >
                                                    <ShieldCheck className="w-4 h-4" />
                                                </Button>
                                            )}

                                            {order.status !== 'completed' && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-green-600 hover:bg-green-50 rounded-lg"
                                                    onClick={(e) => updateStatus(order.id, 'completed', e)}
                                                    title="Mark as Completed"
                                                >
                                                    <CheckCircle2 className="w-4 h-4" />
                                                </Button>
                                            )}

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                                onClick={(e) => handleDelete(order.id, e)}
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

            {/* Order Details Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <div className="flex items-center justify-between mr-8">
                            <DialogTitle className="text-xl font-bold flex items-center gap-2">
                                Order Details
                                <span className="text-sm font-normal text-muted-foreground bg-gray-100 px-2 py-0.5 rounded-md font-mono">
                                    #{selectedOrder?.id?.toString().padStart(4, '0')}
                                </span>
                            </DialogTitle>
                        </div>
                        <DialogDescription>
                            {selectedOrder && `Placed on ${new Date(selectedOrder.created_at).toLocaleString()}`}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedOrder && (
                        <div className="grid gap-6 py-4">
                            {/* Customer Info Section */}
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500 text-xs uppercase font-medium tracking-wider mb-1">Customer</p>
                                    <p className="font-semibold text-gray-900">{selectedOrder.customer_name}</p>
                                    <p className="text-gray-600">{selectedOrder.customer_email}</p>
                                    {selectedOrder.customer_phone && (
                                        <p className="text-gray-600">{selectedOrder.customer_phone}</p>
                                    )}
                                </div>
                                <div className="text-right">
                                    <p className="text-gray-500 text-xs uppercase font-medium tracking-wider mb-1">Order Status</p>
                                    <Badge className={`capitalize ${
                                        selectedOrder.status === 'completed' ? 'bg-green-600' : 'bg-yellow-500'
                                    }`}>
                                        {selectedOrder.status}
                                    </Badge>
                                </div>
                                <div className="col-span-2 mt-2 pt-2 border-t border-gray-100 flex justify-between items-center">
                                    <p className="text-gray-500 text-xs uppercase font-medium tracking-wider">Payment Status</p>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={selectedOrder.payment_status === 'verified' ? 'secondary' : 'outline'} className={
                                            selectedOrder.payment_status === 'verified'
                                                ? 'bg-blue-100 text-blue-700 hover:bg-blue-100 border-transparent'
                                                : 'bg-gray-100 text-gray-700 border-gray-200'
                                        }>
                                            {selectedOrder.payment_status === 'verified' ? 'Verified' : 'Pending'}
                                        </Badge>
                                        {selectedOrder.payment_status !== 'verified' && (
                                            <Button 
                                                size="sm" 
                                                variant="outline" 
                                                className="h-7 text-xs bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                                                onClick={() => updatePaymentStatus(selectedOrder.id, 'verified')}
                                            >
                                                Verify Now
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Order Items List */}
                            <div>
                                <h4 className="font-medium mb-3 text-sm text-gray-900">Items Ordered</h4>
                                <ScrollArea className="h-[240px] rounded-md border p-4">
                                    {loadingDetails ? (
                                        <div className="flex items-center justify-center h-full text-gray-400">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400 mr-2"></div>
                                            Loading items...
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {orderItems.map((item) => (
                                                <div key={item.id} className="flex gap-4 items-center">
                                                    <div className="h-12 w-12 rounded-md bg-gray-100 overflow-hidden border border-gray-200 flex-shrink-0">
                                                        {item.products?.image && (
                                                            <ImageWithFallback
                                                                src={item.products.image}
                                                                alt={item.products.name || "Product"}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-900 truncate">
                                                            {item.products?.name || "Unknown Product"}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {item.products?.category || "Uncategorized"}
                                                        </p>
                                                    </div>
                                                    <div className="text-right text-sm">
                                                        <div className="font-medium">
                                                            ₱{Number(item.price_at_purchase).toLocaleString()}
                                                            <span className="text-gray-400 font-normal mx-1">x</span>
                                                            {item.quantity}
                                                        </div>
                                                        <div className="text-gray-500 font-medium">
                                                            ₱{(Number(item.price_at_purchase) * item.quantity).toLocaleString()}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </ScrollArea>
                            </div>

                            {/* Footer / Total */}
                            <div className="flex items-center justify-between border-t pt-4">
                                <div className="flex gap-2">
                                    {selectedOrder.status !== 'completed' && (
                                        <Button
                                            onClick={() => updateStatus(selectedOrder.id, 'completed')}
                                            className="bg-green-600 hover:bg-green-700 text-white h-9"
                                        >
                                            <CheckCircle2 className="w-4 h-4 mr-2" /> Mark Completed
                                        </Button>
                                    )}
                                </div>
                                <div className="text-right">
                                    <span className="text-gray-500 mr-3 text-sm">Total Amount</span>
                                    <span className="text-2xl font-bold text-blue-600">
                                        ₱{Number(selectedOrder.total_amount).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}