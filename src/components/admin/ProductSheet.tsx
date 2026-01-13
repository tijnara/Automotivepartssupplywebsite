import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "../ui/sheet";
import { ScrollArea } from "../ui/scroll-area";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Database } from "../../types/database.types";
import { Checkbox } from "../ui/checkbox";
import { supabase } from "../../lib/supabase";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";

type Product = Database['public']['Tables']['products']['Row'];
type ProductInsert = Database['public']['Tables']['products']['Insert'];

interface ProductSheetProps {
    product?: Product | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (product: ProductInsert | Product) => Promise<void>;
}

export function ProductSheet({ product, open, onOpenChange, onSave }: ProductSheetProps) {
    const [formData, setFormData] = useState<ProductInsert>({
        name: "",
        category: "",
        brand: "",
        price: 0,
        original_price: null,
        image: "",
        in_stock: true,
        quantity: 0,
        rating: 5,
        reviews: 0
    });
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (product) {
            setFormData({
                ...product
            });
        } else {
            setFormData({
                name: "",
                category: "",
                brand: "",
                price: 0,
                original_price: null,
                image: "",
                in_stock: true,
                quantity: 0,
                rating: 5,
                reviews: 0
            });
        }
    }, [product, open]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        setUploading(true);

        try {
            const { error: uploadError } = await supabase.storage
                .from('products') // Make sure this bucket exists in Supabase
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from('products')
                .getPublicUrl(filePath);

            if (data) {
                setFormData(prev => ({ ...prev, image: data.publicUrl }));
                toast.success("Image uploaded successfully");
            }
        } catch (error: any) {
            console.error("Error uploading image:", error);
            toast.error(error.message || "Failed to upload image");
        } finally {
            setUploading(false);
            // Reset the input value so the same file can be selected again if needed
            e.target.value = "";
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Ensure consistency: if quantity is 0, in_stock must be false
            const finalData = {
                ...formData,
                in_stock: (formData.quantity || 0) > 0 ? formData.in_stock : false
            };
            await onSave(finalData);
            onOpenChange(false);
        } catch (error) {
            console.error("Error saving product:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange} modal={false}>
            <SheetContent side="right" className="flex flex-col w-full sm:max-w-md p-0" overlay={false}>
                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                    <div className="p-6 border-b">
                        <SheetHeader className="text-left">
                            <SheetTitle className="text-xl font-bold">
                                {product ? "Edit Product" : "Add New Product"}
                            </SheetTitle>
                            <SheetDescription>
                                {product ? "Update the details of your product here." : "Fill in the details for the new product."}
                            </SheetDescription>
                        </SheetHeader>
                    </div>

                    <ScrollArea className="flex-1 px-6">
                        <div className="py-6 space-y-6">
                            <div className="space-y-4">
                                <div className="grid gap-3">
                                    <Label htmlFor="name" className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Product Name</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g. Brake Pads"
                                        required
                                        className="h-11 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-600 transition-all"
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="category" className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Category</Label>
                                    <Input
                                        id="category"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        placeholder="e.g. Brakes"
                                        required
                                        className="h-11 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-600 transition-all"
                                    />
                                </div>
                                {/* Brand Input */}
                                <div className="grid gap-3">
                                    <Label htmlFor="brand" className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Brand</Label>
                                    <Input
                                        id="brand"
                                        value={formData.brand || ""}
                                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                        placeholder="e.g. Bosch, Sparco"
                                        className="h-11 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-600 transition-all"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="grid gap-3">
                                        <Label htmlFor="price" className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Price (₱)</Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                            required
                                            className="h-11 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-600 transition-all"
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="quantity" className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Quantity</Label>
                                        <Input
                                            id="quantity"
                                            type="number"
                                            value={formData.quantity ?? 0}
                                            onChange={(e) => {
                                                const val = Number(e.target.value);
                                                setFormData({
                                                    ...formData,
                                                    quantity: val,
                                                    in_stock: val > 0 ? formData.in_stock : false
                                                });
                                            }}
                                            required
                                            className="h-11 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-600 transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="original_price" className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Supplier Price (₱)</Label>
                                    <Input
                                        id="original_price"
                                        type="number"
                                        value={formData.original_price || ""}
                                        onChange={(e) => setFormData({ ...formData, original_price: e.target.value ? Number(e.target.value) : null })}
                                        placeholder="Optional original price"
                                        className="h-11 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-600 transition-all"
                                    />
                                </div>

                                {/* Image Upload Section */}
                                <div className="grid gap-3">
                                    <Label htmlFor="image" className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Product Image</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="image"
                                            value={formData.image}
                                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                            placeholder="https://..."
                                            required
                                            className="flex-1 h-11 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-600 transition-all"
                                        />
                                        <div className="relative">
                                            <input
                                                type="file"
                                                id="file-upload"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                disabled={uploading}
                                            />
                                            <Label
                                                htmlFor="file-upload"
                                                className={`flex items-center justify-center h-11 w-11 rounded-md border border-gray-200 bg-white hover:bg-gray-50 cursor-pointer transition-colors shadow-sm ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                {uploading ? (
                                                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                                                ) : (
                                                    <Upload className="w-5 h-5 text-gray-600" />
                                                )}
                                            </Label>
                                        </div>
                                    </div>
                                    {formData.image && (
                                        <div className="relative w-full h-40 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                                            <img
                                                src={formData.image}
                                                alt="Preview"
                                                className="w-full h-full object-contain"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=Invalid+Image';
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center space-x-2 pt-2">
                                    <Checkbox
                                        id="in_stock"
                                        checked={formData.in_stock}
                                        onCheckedChange={(checked) => {
                                            const isChecked = checked === true;
                                            setFormData({
                                                ...formData,
                                                in_stock: (formData.quantity || 0) > 0 ? isChecked : false
                                            });
                                        }}
                                    />
                                    <Label htmlFor="in_stock" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                                        In Stock
                                    </Label>
                                </div>
                            </div>
                        </div>
                    </ScrollArea>

                    <div className="p-6 border-t bg-gray-50/50 flex flex-col gap-2">
                        <Button type="submit" disabled={loading || uploading} className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 font-bold">
                            {loading ? "Saving..." : (product ? "Save Changes" : "Add Product")}
                        </Button>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    );
}