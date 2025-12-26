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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Database } from "../../types/database.types";

type Product = Database['public']['Tables']['products']['Row'];

interface InventoryAdjustmentSheetProps {
    product: Product | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (amount: number, type: "add" | "remove", reason: string, notes: string) => Promise<void>;
}

export function InventoryAdjustmentSheet({ product, open, onOpenChange, onSave }: InventoryAdjustmentSheetProps) {
    const [adjustmentAmount, setAdjustmentAmount] = useState(0);
    const [adjustmentType, setAdjustmentType] = useState<"add" | "remove">("add");
    const [adjustmentReason, setAdjustmentReason] = useState("Restock");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            setAdjustmentAmount(0);
            setAdjustmentType("add");
            setAdjustmentReason("Restock");
            setNotes("");
        }
    }, [open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!product || adjustmentAmount <= 0) return;
        
        setLoading(true);
        try {
            await onSave(adjustmentAmount, adjustmentType, adjustmentReason, notes);
            onOpenChange(false);
        } catch (error) {
            console.error("Error adjusting inventory:", error);
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
                                Inventory Adjustment
                            </SheetTitle>
                            <SheetDescription>
                                Update stock levels for <span className="font-semibold text-blue-600">{product?.name}</span>
                            </SheetDescription>
                        </SheetHeader>
                    </div>

                    <ScrollArea className="flex-1 px-6">
                        <div className="py-6 space-y-6">
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="grid gap-3">
                                        <Label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Action</Label>
                                        <Select 
                                            value={adjustmentType} 
                                            onValueChange={(v: "add" | "remove") => {
                                                setAdjustmentType(v);
                                                setAdjustmentReason(v === "add" ? "Restock" : "Sale");
                                            }}
                                        >
                                            <SelectTrigger className="h-11 bg-gray-50 border-gray-200 focus:bg-white focus:ring-blue-600 transition-all">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="add" className="text-green-600 font-medium">Add Stock (+)</SelectItem>
                                                <SelectItem value="remove" className="text-red-600 font-medium">Remove Stock (-)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="quantity" className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Quantity</Label>
                                        <Input
                                            id="quantity"
                                            type="number"
                                            min="1"
                                            value={adjustmentAmount || ''}
                                            onChange={(e) => setAdjustmentAmount(parseInt(e.target.value))}
                                            required
                                            className="h-11 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-600 transition-all font-bold text-lg"
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-3">
                                    <Label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Reason for Adjustment</Label>
                                    <Select value={adjustmentReason} onValueChange={setAdjustmentReason}>
                                        <SelectTrigger className="h-11 bg-gray-50 border-gray-200 focus:bg-white focus:ring-blue-600 transition-all">
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

                                <div className="grid gap-3">
                                    <Label htmlFor="notes" className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Notes (Optional)</Label>
                                    <Input
                                        id="notes"
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Reference number, details, or specific reasons..."
                                        className="h-11 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-600 transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </ScrollArea>

                    <div className="p-6 border-t bg-gray-50/50 flex flex-col gap-2">
                        <Button 
                            type="submit" 
                            disabled={loading || !adjustmentAmount || adjustmentAmount <= 0} 
                            className={`w-full h-11 font-bold text-white transition-all shadow-lg ${
                                adjustmentType === "add" 
                                    ? "bg-green-600 hover:bg-green-700 shadow-green-100" 
                                    : "bg-red-600 hover:bg-red-700 shadow-red-100"
                            }`}
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Updating...
                                </div>
                            ) : (
                                adjustmentType === "add" ? "Add to Inventory" : "Remove from Inventory"
                            )}
                        </Button>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    );
}
