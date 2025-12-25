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
        price: 0,
        original_price: null,
        image: "",
        in_stock: true,
        rating: 5,
        reviews: 0
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (product) {
            setFormData({
                ...product
            });
        } else {
            setFormData({
                name: "",
                category: "",
                price: 0,
                original_price: null,
                image: "",
                in_stock: true,
                rating: 5,
                reviews: 0
            });
        }
    }, [product, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave(formData);
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
                                <div className="grid grid-cols-2 gap-6">
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
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="image" className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Image URL</Label>
                                    <Input
                                        id="image"
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        placeholder="https://..."
                                        required
                                        className="h-11 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-600 transition-all"
                                    />
                                </div>
                                <div className="flex items-center space-x-2 pt-2">
                                    <Checkbox 
                                        id="in_stock" 
                                        checked={formData.in_stock} 
                                        onCheckedChange={(checked) => setFormData({ ...formData, in_stock: checked === true })}
                                    />
                                    <Label htmlFor="in_stock" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                                        In Stock
                                    </Label>
                                </div>
                            </div>
                        </div>
                    </ScrollArea>

                    <div className="p-6 border-t bg-gray-50/50 flex flex-col gap-2">
                        <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 font-bold">
                            {loading ? "Saving..." : (product ? "Save Changes" : "Add Product")}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="w-full h-11">
                            Cancel
                        </Button>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    );
}
