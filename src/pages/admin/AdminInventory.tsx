import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Database } from "../../types/database.types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Plus, Minus, History, PackageSearch } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "../../components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";

type Product = Database['public']['Tables']['products']['Row'];
type InventoryTransaction = Database['public']['Tables']['inventory_transactions']['Row'] & {
    products: { name: string } | null
};

export default function AdminInventory() {
    const [products, setProducts] = useState<Product[]>([]);
    const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);

    // Dialog State
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [adjustmentAmount, setAdjustmentAmount] = useState(0);
    const [adjustmentType, setAdjustmentType] = useState<"add" | "remove">("add");
    const [adjustmentReason, setAdjustmentReason] = useState("Restock");
    const [notes, setNotes] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const [prodRes, transRes] = await Promise.all([
            supabase.from('products').select('*').order('name'),
            supabase.from('inventory_transactions').select('*, products(name)').order('created_at', { ascending: false }).limit(50)
        ]);

        if (prodRes.error) toast.error("Failed to load products");
        else setProducts(prodRes.data || []);

        if (transRes.error) toast.error("Failed to load history");
        else setTransactions(transRes.data as any || []);
    };

    const openAdjustmentDialog = (product: Product, type: "add" | "remove") => {
        setSelectedProduct(product);
        setAdjustmentType(type);
        setAdjustmentAmount(0);
        setAdjustmentReason(type === "add" ? "Restock" : "Sale");
        setNotes("");
        setIsDialogOpen(true);
    };

    const handleStockAdjustment = async () => {
        if (!selectedProduct || adjustmentAmount <= 0) return;
        setSubmitting(true);

        const change = adjustmentType === "add" ? adjustmentAmount : -adjustmentAmount;
        const newQuantity = (selectedProduct.quantity || 0) + change;

        // 1. Insert Transaction Log
        const { error: transError } = await supabase.from('inventory_transactions').insert([{
            product_id: selectedProduct.id,
            quantity_change: change,
            transaction_type: adjustmentReason,
            notes: notes
        }]);

        if (transError) {
            toast.error("Failed to log transaction");
            setSubmitting(false);
            return;
        }

        // 2. Update Product Quantity
        const { error: prodError } = await supabase.from('products').update({
            quantity: newQuantity,
            in_stock: newQuantity > 0
        }).eq('id', selectedProduct.id);

        if (prodError) {
            toast.error("Failed to update product quantity");
        } else {
            toast.success("Stock updated successfully");
            setIsDialogOpen(false);
            fetchData();
        }
        setSubmitting(false);
    };

    return (
        <AdminLayout
            title="Inventory"
            description="Track stock levels and view inventory history."
        >
            <Tabs defaultValue="stock" className="w-full">
                <TabsList className="mb-6">
                    <TabsTrigger value="stock" className="gap-2"><PackageSearch className="w-4 h-4"/> Stock Levels</TabsTrigger>
                    <TabsTrigger value="history" className="gap-2"><History className="w-4 h-4"/> Movement History</TabsTrigger>
                </TabsList>

                {/* Stock Levels Tab */}
                <TabsContent value="stock">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <Table>
                            <TableHeader className="bg-gray-50/80">
                                <TableRow>
                                    <TableHead className="font-bold text-gray-700">Product Name</TableHead>
                                    <TableHead className="font-bold text-gray-700">Category</TableHead>
                                    <TableHead className="text-center font-bold text-gray-700">Current Stock</TableHead>
                                    <TableHead className="text-center font-bold text-gray-700">Status</TableHead>
                                    <TableHead className="text-center font-bold text-gray-700">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.map((product) => (
                                    <TableRow key={product.id} className="hover:bg-gray-50">
                                        <TableCell className="font-medium">{product.name}</TableCell>
                                        <TableCell className="text-gray-500">{product.category}</TableCell>
                                        <TableCell className="text-center text-lg font-semibold text-gray-900">
                                            {product.quantity || 0}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant={product.in_stock ? "secondary" : "destructive"} className={
                                                product.in_stock
                                                    ? "bg-green-100 text-green-700 hover:bg-green-100"
                                                    : "bg-red-100 text-red-700 hover:bg-red-100"
                                            }>
                                                {product.in_stock ? "In Stock" : "Out of Stock"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex justify-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8 w-8 p-0 text-green-600 border-green-200 hover:bg-green-50 hover:border-green-300"
                                                    onClick={() => openAdjustmentDialog(product, "add")}
                                                    title="Add Stock"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8 w-8 p-0 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                                                    onClick={() => openAdjustmentDialog(product, "remove")}
                                                    title="Remove Stock"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                {/* History Tab */}
                <TabsContent value="history">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <Table>
                            <TableHeader className="bg-gray-50/80">
                                <TableRow>
                                    <TableHead className="font-bold text-gray-700">Date</TableHead>
                                    <TableHead className="font-bold text-gray-700">Product</TableHead>
                                    <TableHead className="font-bold text-gray-700">Type</TableHead>
                                    <TableHead className="text-center font-bold text-gray-700">Change</TableHead>
                                    <TableHead className="font-bold text-gray-700">Notes</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">No history available</TableCell>
                                    </TableRow>
                                ) : (
                                    transactions.map((t) => (
                                        <TableRow key={t.id}>
                                            <TableCell className="text-sm text-gray-500">
                                                {new Date(t.created_at).toLocaleString()}
                                            </TableCell>
                                            <TableCell className="font-medium">{t.products?.name || "Unknown Product"}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="capitalize">
                                                    {t.transaction_type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className={`text-center font-bold ${t.quantity_change > 0 ? "text-green-600" : "text-red-600"}`}>
                                                {t.quantity_change > 0 ? "+" : ""}{t.quantity_change}
                                            </TableCell>
                                            <TableCell className="text-gray-500 text-sm max-w-xs truncate" title={t.notes || ""}>
                                                {t.notes || "-"}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Adjustment Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{adjustmentType === "add" ? "Add Stock" : "Remove Stock"}</DialogTitle>
                        <DialogDescription>
                            Adjusting inventory for: <span className="font-semibold text-gray-900">{selectedProduct?.name}</span>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Quantity to {adjustmentType}</Label>
                            <Input
                                type="number"
                                min="1"
                                value={adjustmentAmount || ''}
                                onChange={(e) => setAdjustmentAmount(parseInt(e.target.value))}
                                className="text-lg font-semibold"
                                autoFocus
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Reason</Label>
                            <Select value={adjustmentReason} onValueChange={setAdjustmentReason}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {adjustmentType === "add" ? (
                                        <>
                                            <SelectItem value="Restock">Restock</SelectItem>
                                            <SelectItem value="Return">Customer Return</SelectItem>
                                            <SelectItem value="Adjustment">Inventory Adjustment</SelectItem>
                                        </>
                                    ) : (
                                        <>
                                            <SelectItem value="Sale">Direct Sale</SelectItem>
                                            <SelectItem value="Damage">Damaged / Expired</SelectItem>
                                            <SelectItem value="Correction">Inventory Correction</SelectItem>
                                        </>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Notes (Optional)</Label>
                            <Input
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Reference number, details, etc."
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button
                            onClick={handleStockAdjustment}
                            disabled={submitting || adjustmentAmount <= 0}
                            className={adjustmentType === "add" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
                        >
                            {submitting ? "Updating..." : "Confirm Adjustment"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}