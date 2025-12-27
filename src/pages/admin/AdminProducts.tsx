import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Database } from "../../types/database.types";
import { Button } from "../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Trash2, Plus, Package, Search, Edit2, TrendingUp, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { Input } from "../../components/ui/input";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { ProductSheet } from "../../components/admin/ProductSheet";

type Product = Database['public']['Tables']['products']['Row'];
type ProductInsert = Database['public']['Tables']['products']['Insert'];

export default function AdminProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [filter, setFilter] = useState("");
    const [loading, setLoading] = useState(true);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('products').select('*').order('id', { ascending: true });
        if (error) toast.error("Failed to load products");
        else setProducts(data || []);
        setLoading(false);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;

        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) {
            toast.error("Error deleting product");
        } else {
            toast.success("Product deleted successfully");
            setProducts(products.filter(p => p.id !== id));
        }
    };

    const handleSaveProduct = async (productData: ProductInsert | Product) => {
        if ('id' in productData && productData.id) {
            // Update
            const { error } = await supabase
                .from('products')
                .update(productData as any)
                .eq('id', productData.id);

            if (error) throw error;
            toast.success("Product updated successfully");
        } else {
            // Insert
            const { error } = await supabase
                .from('products')
                .insert([productData as ProductInsert]);

            if (error) throw error;
            toast.success("Product added successfully");
        }
        fetchProducts();
    };

    const openEditSheet = (product: Product) => {
        setEditingProduct(product);
        setIsSheetOpen(true);
    };

    const openAddSheet = () => {
        setEditingProduct(null);
        setIsSheetOpen(true);
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(filter.toLowerCase()) ||
        p.category.toLowerCase().includes(filter.toLowerCase()) ||
        (p.brand && p.brand.toLowerCase().includes(filter.toLowerCase()))
    );

    const outOfStockCount = products.filter(p => !p.in_stock || (p.quantity || 0) <= 0).length;

    return (
        <AdminLayout
            title="Products"
            description="Manage your inventory, prices, and stock levels."
        >
            {/* Stats Tiles */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {/* Total Products Tile */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center p-6 text-center">
                    <div className="p-3 bg-blue-50 rounded-xl text-blue-600 mb-3">
                        <Package className="w-6 h-6" />
                    </div>
                    <p className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Total Products</p>
                    <h3 className="text-2xl sm:text-3xl font-black text-gray-900">{products.length}</h3>
                    <div className="mt-3 w-10 h-1 bg-blue-600 rounded-full opacity-20"></div>
                </div>

                {/* Active Categories Tile */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center p-6 text-center">
                    <div className="p-3 bg-green-50 rounded-xl text-green-600 mb-3">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <p className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Active Categories</p>
                    <h3 className="text-2xl sm:text-3xl font-black text-gray-900">
                        {new Set(products.map(p => p.category)).size}
                    </h3>
                    <div className="mt-3 w-10 h-1 bg-green-600 rounded-full opacity-20"></div>
                </div>

                {/* Out of Stock Tile */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center p-6 text-center">
                    <div className="p-3 bg-orange-50 rounded-xl text-orange-600 mb-3">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <p className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Out of Stock</p>
                    <h3 className="text-2xl sm:text-3xl font-black text-gray-900">{outOfStockCount}</h3>
                    <div className="mt-3 w-10 h-1 bg-orange-600 rounded-full opacity-20"></div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">

                {/* Search Field Container */}
                <div className="relative w-full md:w-96 flex items-center">
                    <Input
                        placeholder="Search products, brands..."
                        className="pl-6 pr-12 h-12 w-full rounded-full border-2 border-gray-600 focus-visible:ring-0 focus-visible:border-black transition-all text-base shadow-none placeholder:text-gray-500 font-bold bg-white"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                    <Search className="absolute right-4 w-6 h-6 text-gray-700 stroke-[2.5] pointer-events-none" />
                </div>

                <Button
                    onClick={openAddSheet}
                    className="h-12 bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 rounded-full px-8 w-full md:w-auto transition-all active:scale-95 flex items-center gap-2 font-bold"
                >
                    <Plus className="w-5 h-5 stroke-[3]" /> Add New Product
                </Button>
            </div>

            {/* Product Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <Table className="border-collapse border border-gray-200">
                    <TableHeader className="bg-gray-50/80 border-b border-gray-200">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-[100px] py-4 text-center border border-gray-200 font-bold text-gray-700">Image</TableHead>
                            <TableHead className="py-4 text-center border border-gray-200 font-bold text-gray-700">Product Name</TableHead>
                            <TableHead className="py-4 text-center border border-gray-200 font-bold text-gray-700">Category</TableHead>
                            <TableHead className="py-4 text-center border border-gray-200 font-bold text-gray-700">Brand</TableHead>
                            <TableHead className="py-4 text-center border border-gray-200 font-bold text-gray-700">Price</TableHead>
                            <TableHead className="py-4 text-center border border-gray-200 font-bold text-gray-700">Supplier Price</TableHead>
                            <TableHead className="py-4 text-center border border-gray-200 font-bold text-gray-700">Stock Status</TableHead>
                            <TableHead className="py-4 text-center border border-gray-200 font-bold text-gray-700">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-20 border border-gray-200">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-gray-500 font-medium">Loading inventory...</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredProducts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-16 text-gray-500 border border-gray-200">
                                    <div className="flex flex-col items-center justify-center gap-3">
                                        <Package className="w-12 h-12 text-gray-200" />
                                        <p>No products found matching your search.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredProducts.map((product) => (
                                <TableRow
                                    key={product.id}
                                    className="group hover:bg-accent hover:text-accent-foreground transition-colors border-b border-gray-200 cursor-pointer"
                                    onClick={() => openEditSheet(product)}
                                >
                                    <TableCell className="py-4 text-center border border-gray-200">
                                        <div className="flex justify-center">
                                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
                                                <ImageWithFallback
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                                                />
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4 font-medium text-gray-900 text-center border border-gray-200">{product.name}</TableCell>
                                    <TableCell className="py-4 text-center border border-gray-200">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200 uppercase tracking-wider">
                                            {product.category}
                                        </span>
                                    </TableCell>
                                    <TableCell className="py-4 text-center border border-gray-200">
                                        <span className="text-gray-600 font-medium">{product.brand || "—"}</span>
                                    </TableCell>
                                    <TableCell className="py-4 font-semibold text-gray-700 text-center border border-gray-200">₱{Number(product.price).toLocaleString()}</TableCell>
                                    <TableCell className="py-4 font-semibold text-gray-700 text-center border border-gray-200">
                                        {product.original_price ? `₱${Number(product.original_price).toLocaleString()}` : "—"}
                                    </TableCell>
                                    <TableCell className="py-4 text-center border border-gray-200">
                                        <div className="flex justify-center">
                                            {(product.in_stock && (product.quantity || 0) > 0) ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" />
                                                    In Stock
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                                                    Out of Stock
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4 text-center border border-gray-200">
                                        <div className="flex justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openEditSheet(product);
                                                }}
                                                title="Edit Product"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(product.id);
                                                }}
                                                title="Delete Product"
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

            <ProductSheet
                open={isSheetOpen}
                onOpenChange={setIsSheetOpen}
                product={editingProduct}
                onSave={handleSaveProduct}
            />
        </AdminLayout>
    );
}