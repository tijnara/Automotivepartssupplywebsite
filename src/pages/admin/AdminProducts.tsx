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
        p.category.toLowerCase().includes(filter.toLowerCase())
    );

    const outOfStockCount = products.filter(p => !p.in_stock).length;

    return (
        <AdminLayout 
            title="Products" 
            description="Manage your inventory, prices, and stock levels."
        >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-5 transition-all hover:shadow-md">
                    <div className="p-4 bg-blue-50 rounded-full text-blue-600">
                        <Package className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Products</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-1">{products.length}</h3>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-5 transition-all hover:shadow-md">
                    <div className="p-4 bg-green-50 rounded-full text-green-600">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Active Categories</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-1">
                            {new Set(products.map(p => p.category)).size}
                        </h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-5 transition-all hover:shadow-md">
                    <div className="p-4 bg-orange-50 rounded-full text-orange-600">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Out of Stock</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-1">{outOfStockCount}</h3>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors w-4 h-4" />
                    <Input
                        placeholder="Search by name or category..."
                        className="pl-10 h-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-600 transition-all rounded-lg"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
                <Button 
                    onClick={openAddSheet}
                    className="h-10 bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 rounded-lg px-6 w-full md:w-auto transition-all active:scale-95 flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Add New Product
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
                            <TableHead className="py-4 text-center border border-gray-200 font-bold text-gray-700">Price</TableHead>
                            <TableHead className="py-4 text-center border border-gray-200 font-bold text-gray-700">Supplier Price</TableHead>
                            <TableHead className="py-4 text-center border border-gray-200 font-bold text-gray-700">Stock Status</TableHead>
                            <TableHead className="py-4 text-center border border-gray-200 font-bold text-gray-700">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-20 border border-gray-200">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-gray-500 font-medium">Loading inventory...</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredProducts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-16 text-gray-500 border border-gray-200">
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
                                    className="group hover:bg-blue-50/30 transition-colors border-b border-gray-200 cursor-pointer"
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
                                    <TableCell className="py-4 font-semibold text-gray-700 text-center border border-gray-200">₱{Number(product.price).toLocaleString()}</TableCell>
                                    <TableCell className="py-4 font-semibold text-gray-700 text-center border border-gray-200">
                                        {product.original_price ? `₱${Number(product.original_price).toLocaleString()}` : "—"}
                                    </TableCell>
                                    <TableCell className="py-4 text-center border border-gray-200">
                                        <div className="flex justify-center">
                                            {product.in_stock ? (
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