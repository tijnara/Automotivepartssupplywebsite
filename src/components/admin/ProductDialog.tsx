import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Database } from "../../types/database.types";
import { Checkbox } from "../ui/checkbox";

type Product = Database['public']['Tables']['products']['Row'];
type ProductInsert = Database['public']['Tables']['products']['Insert'];

interface ProductDialogProps {
    product?: Product | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (product: ProductInsert | Product) => Promise<void>;
}

export function ProductDialog({ product, open, onOpenChange, onSave }: ProductDialogProps) {
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
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{product ? "Edit Product" : "Add New Product"}</DialogTitle>
                        <DialogDescription>
                            {product ? "Update the details of your product here." : "Fill in the details for the new product."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Product Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Brake Pads"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="category">Category</Label>
                                <Input
                                    id="category"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    placeholder="e.g. Brakes"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="price">Price (₱)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="image">Image URL</Label>
                            <Input
                                id="image"
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                placeholder="https://..."
                                required
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
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                            {loading ? "Saving..." : "Save Product"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
