import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Database } from "../../types/database.types";
import { Button } from "../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Trash2, Plus, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

type Product = Database['public']['Tables']['products']['Row'];

export default function AdminProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const { data, error } = await supabase.from('products').select('*').order('id', { ascending: true });
        if (error) toast.error("Failed to load products");
        else setProducts(data || []);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) {
            toast.error("Error deleting product");
        } else {
            toast.success("Product deleted");
            setProducts(products.filter(p => p.id !== id));
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/login");
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Product Management</h1>
                    <div className="flex gap-4">
                        <Button variant="outline" onClick={handleLogout}>
                            <LogOut className="w-4 h-4 mr-2" /> Logout
                        </Button>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" /> Add Product
                        </Button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Image</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell>
                                        <div className="w-12 h-12 rounded overflow-hidden bg-gray-100">
                                            <ImageWithFallback
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell>{product.category}</TableCell>
                                    <TableCell>₱{product.price}</TableCell>
                                    <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${product.in_stock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {product.in_stock ? 'In Stock' : 'Out of Stock'}
                    </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => handleDelete(product.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}