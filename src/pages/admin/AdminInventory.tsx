import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Database } from "../../types/database.types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Plus, Minus, History, PackageSearch } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { Button } from "../../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { InventoryAdjustmentSheet } from "../../components/admin/InventoryAdjustmentSheet";
import { Badge } from "../../components/ui/badge";

type Product = Database['public']['Tables']['products']['Row'];
type InventoryTransaction = Database['public']['Tables']['inventory_transactions']['Row'] & {
    products: { name: string } | null
};

export default function AdminInventory() {
    const [products, setProducts] = useState<Product[]>([]);
    const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);

    // Sheet State
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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

    const openAdjustmentSheet = (product: Product) => {
        setSelectedProduct(product);
        setIsSheetOpen(true);
    };

    const handleStockAdjustment = async (amount: number, type: "add" | "remove", reason: string, notes: string) => {
        if (!selectedProduct || amount <= 0) return;

        const change = type === "add" ? amount : -amount;
        const newQuantity = (selectedProduct.quantity || 0) + change;

        // 1. Insert Transaction Log
        const { error: transError } = await supabase.from('inventory_transactions').insert([{
            product_id: selectedProduct.id,
            quantity_change: change,
            transaction_type: reason,
            notes: notes
        }]);

        if (transError) {
            toast.error("Failed to log transaction");
            throw transError;
        }

        // 2. Update Product Quantity
        const { error: prodError } = await supabase.from('products').update({
            quantity: newQuantity,
            in_stock: newQuantity > 0
        }).eq('id', selectedProduct.id);

        if (prodError) {
            toast.error("Failed to update product quantity");
            throw prodError;
        } else {
            toast.success("Stock updated successfully");
            fetchData();
        }
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
                                            <Badge variant={(product.in_stock && (product.quantity || 0) > 0) ? "secondary" : "destructive"} className={
                                                (product.in_stock && (product.quantity || 0) > 0)
                                                    ? "bg-green-100 text-green-700 hover:bg-green-100"
                                                    : "bg-red-100 text-red-700 hover:bg-red-100"
                                            }>
                                                {(product.in_stock && (product.quantity || 0) > 0) ? "In Stock" : "Out of Stock"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-8 gap-1.5 text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                                                onClick={() => openAdjustmentSheet(product)}
                                                title="Adjust Stock"
                                            >
                                                <div className="flex items-center -space-x-1">
                                                    <Plus className="w-3.5 h-3.5" />
                                                    <Minus className="w-3.5 h-3.5" />
                                                </div>
                                                <span className="font-medium">Adjust</span>
                                            </Button>
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

            <InventoryAdjustmentSheet
                open={isSheetOpen}
                onOpenChange={setIsSheetOpen}
                product={selectedProduct}
                onSave={handleStockAdjustment}
            />
        </AdminLayout>
    );
}