import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Database } from "../../types/database.types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { ShoppingBag, Calendar, CheckCircle2, Clock, Trash2, Eye, CreditCard, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { Button } from "../../components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "../../components/ui/sheet";
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
    const [isSheetOpen, setIsSheetOpen] = useState(false);

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
        // Set state in a specific order to ensure data availability
        setSelectedOrder(order);
        setLoadingDetails(true);
        setIsSheetOpen(true);

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
            if (selectedOrder?.id === id) setIsSheetOpen(false);
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

    // Safe accessor for Order ID
    const displayOrderId = selectedOrder ? `#${selectedOrder.id.toString().padStart(4, '0')}` : 'Loading...';

    return (
        <AdminLayout
            title="Orders"
            description="Manage customer orders and track fulfillment status."
        >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <Table className="border-collapse border border-gray-200">
                    <TableHeader className="bg-gray-50/80 border-b border-gray-200">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="py-4 text-center border border-gray-200 font-bold text-gray-700 w-[100px]">Order ID</TableHead>
                            <TableHead className="py-4 text-center border border-gray-200 font-bold text-gray-700">Customer</TableHead>
                            <TableHead className="py-4 text-center border border-gray-200 font-bold text-gray-700">Total Amount</TableHead>
                            <TableHead className="py-4 text-center border border-gray-200 font-bold text-gray-700">Payment</TableHead>
                            <TableHead className="py-4 text-center border border-gray-200 font-bold text-gray-700">Status</TableHead>
                            <TableHead className="py-4 text-center border border-gray-200 font-bold text-gray-700">Date</TableHead>
                            <TableHead className="py-4 text-center border border-gray-200 font-bold text-gray-700">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-20 border border-gray-200">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-gray-500 font-medium">Loading orders...</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-16 text-gray-500 border border-gray-200">
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
                                    className="group hover:bg-blue-50/30 transition-colors border-b border-gray-200 cursor-pointer"
                                    onClick={() => fetchOrderDetails(order)}
                                >
                                    <TableCell className="py-4 text-center border border-gray-200">
                                        <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block">
                                            #{order.id.toString().padStart(4, '0')}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-center border border-gray-200">
                                        <div className="flex flex-col items-center">
                                            <span className="font-semibold text-gray-900">{order.customer_name}</span>
                                            <span className="text-xs text-gray-500">{order.customer_email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center font-bold text-gray-900 border border-gray-200">
                                        ₱{Number(order.total_amount).toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-center border border-gray-200">
                                        <div className="flex justify-center">
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
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center border border-gray-200">
                                        <div className="flex justify-center">
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
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center border border-gray-200">
                                        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center border border-gray-200">
                                        <div className="flex justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    fetchOrderDetails(order);
                                                }}
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

            {/* Order Details Sheet */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen} modal={false}>
                <SheetContent side="right" className="flex flex-col w-full sm:max-w-md p-0" overlay={false}>
                    <div className="p-6 border-b">
                        <SheetHeader className="text-left">
                            <div className="flex items-center justify-between">
                                <SheetTitle className="text-xl font-bold">Order Details</SheetTitle>
                                <span className="text-sm font-mono bg-blue-50 text-blue-600 px-2 py-1 rounded">
                                    {displayOrderId}
                                </span>
                            </div>
                            <SheetDescription>
                                {selectedOrder ? `Placed on ${new Date(selectedOrder.created_at).toLocaleString()}` : "Loading details..."}
                            </SheetDescription>
                        </SheetHeader>
                    </div>

                    {selectedOrder && (
                        <>
                            <ScrollArea className="flex-1 px-6">
                                <div className="py-6 space-y-6">
                                    {/* Customer Info Section */}
                                    <div className="space-y-4">
                                        <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-500">Customer Information</h4>
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-3">
                                            <div>
                                                <p className="text-xs text-gray-500">Name & Email</p>
                                                <p className="font-medium">{selectedOrder.customer_name}</p>
                                                <p className="text-sm text-gray-600">{selectedOrder.customer_email}</p>
                                            </div>
                                            {selectedOrder.customer_phone && (
                                                <div>
                                                    <p className="text-xs text-gray-500">Phone</p>
                                                    <p className="text-sm text-gray-600">{selectedOrder.customer_phone}</p>
                                                </div>
                                            )}
                                            <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                                                <div>
                                                    <p className="text-xs text-gray-500">Order Status</p>
                                                    <Badge className={`capitalize mt-1 ${
                                                        selectedOrder.status === 'completed' ? 'bg-green-600' : 'bg-yellow-500'
                                                    }`}>
                                                        {selectedOrder.status}
                                                    </Badge>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-gray-500">Payment</p>
                                                    <Badge variant={selectedOrder.payment_status === 'verified' ? 'secondary' : 'outline'} className={`mt-1 ${
                                                        selectedOrder.payment_status === 'verified'
                                                            ? 'bg-blue-100 text-blue-700 hover:bg-blue-100 border-transparent'
                                                            : 'bg-gray-100 text-gray-700 border-gray-200'
                                                    }`}>
                                                        {selectedOrder.payment_status === 'verified' ? 'Verified' : 'Pending'}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Items List */}
                                    <div className="space-y-4">
                                        <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-500">Items Ordered</h4>
                                        {loadingDetails ? (
                                            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                                                <p>Loading items...</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {orderItems.map((item) => (
                                                    <div key={item.id} className="flex gap-4">
                                                        <div
                                                            className="bg-gray-100 rounded-md overflow-hidden flex-shrink-0 border border-gray-100"
                                                            style={{ width: '80px', height: '80px', minWidth: '80px' }}
                                                        >
                                                            {item.products?.image && (
                                                                <ImageWithFallback
                                                                    src={item.products.image}
                                                                    alt={item.products.name || "Product"}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            )}
                                                        </div>
                                                        <div className="flex-1 flex flex-col justify-between py-0.5">
                                                            <div>
                                                                <h4 className="font-medium text-sm line-clamp-2 text-gray-900">
                                                                    {item.products?.name || "Unknown Product"}
                                                                </h4>
                                                                <p className="text-xs text-gray-500 mt-1">
                                                                    {item.products?.category || "Uncategorized"}
                                                                </p>
                                                            </div>
                                                            <div className="flex justify-between items-end">
                                                                <div className="text-xs text-gray-500">
                                                                    ₱{Number(item.price_at_purchase).toLocaleString()} x {item.quantity}
                                                                </div>
                                                                <div className="text-blue-600 font-bold text-sm">
                                                                    ₱{(Number(item.price_at_purchase) * item.quantity).toLocaleString()}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </ScrollArea>

                            {/* Footer / Actions */}
                            <div className="p-6 border-t bg-gray-50/50 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 font-medium">Total Amount</span>
                                    <span className="text-2xl font-bold text-blue-600">
                                        ₱{Number(selectedOrder.total_amount).toLocaleString()}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 gap-2">
                                    {selectedOrder.payment_status !== 'verified' && (
                                        <Button
                                            onClick={() => updatePaymentStatus(selectedOrder.id, 'verified')}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 font-bold"
                                        >
                                            <ShieldCheck className="w-4 h-4 mr-2" /> Verify Payment
                                        </Button>
                                    )}
                                    {selectedOrder.status !== 'completed' && (
                                        <Button
                                            onClick={() => updateStatus(selectedOrder.id, 'completed')}
                                            className="w-full bg-green-600 hover:bg-green-700 text-white h-11 font-bold"
                                        >
                                            <CheckCircle2 className="w-4 h-4 mr-2" /> Mark as Completed
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </AdminLayout>
    );
}