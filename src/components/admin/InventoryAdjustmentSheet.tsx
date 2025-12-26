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
import { Loader2, Plus, Minus } from "lucide-react";

type Product = Database['public']['Tables']['products']['Row'];

interface InventoryAdjustmentSheetProps {
    product: Product | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (amount: number, type: "add" | "remove", reason: string, notes: string) => Promise<void>;
}

export function InventoryAdjustmentSheet({ product, open, onOpenChange, onSave }: InventoryAdjustmentSheetProps) {
    const [adjustmentAmount, setAdjustmentAmount] = useState<number | "">("");
    const [adjustmentType, setAdjustmentType] = useState<"add" | "remove">("add");
    const [adjustmentReason, setAdjustmentReason] = useState("Restock");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            setAdjustmentAmount("");
            setAdjustmentType("add");
            setAdjustmentReason("Restock");
            setNotes("");
        }
    }, [open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const amount = Number(adjustmentAmount);
        if (!product || amount <= 0) return;

        setLoading(true);
        try {
            await onSave(amount, adjustmentType, adjustmentReason, notes);
            onOpenChange(false);
        } catch (error) {
            console.error("Error adjusting inventory:", error);
        } finally {
            setLoading(false);
        }
    };

    const isAdd = adjustmentType === "add";
    const amountValue = Number(adjustmentAmount);
    const isValid = amountValue > 0;

    return (
        <Sheet open={open} onOpenChange={onOpenChange} modal={true}>
            <SheetContent side="right" className="flex flex-col w-full sm:max-w-md p-0 gap-0" overlay={true}>
                {/* Header Section */}
                <div className="p-6 border-b bg-white flex-shrink-0">
                    <SheetHeader className="text-left">
                        <SheetTitle className="text-xl font-bold flex items-center gap-2">
                            {isAdd ? <Plus className="w-5 h-5 text-green-500" /> : <Minus className="w-5 h-5 text-red-500" />}
                            {isAdd ? "Add to Inventory" : "Remove Stock"}
                        </SheetTitle>
                        <SheetDescription>
                            Adjusting stock for <span className="font-semibold text-blue-600">{product?.name}</span>
                        </SheetDescription>
                    </SheetHeader>
                </div>

                {/* Scrollable Form Content */}
                <ScrollArea className="flex-1 bg-white">
                    <form id="inventory-form" onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</Label>
                                    <Select
                                        value={adjustmentType}
                                        onValueChange={(v: "add" | "remove") => {
                                            setAdjustmentType(v);
                                            setAdjustmentReason(v === "add" ? "Restock" : "Sale");
                                        }}
                                    >
                                        <SelectTrigger className="h-11 bg-gray-50 border-gray-200 focus:ring-2 focus:ring-blue-600/20">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="add" className="font-medium text-green-500">Add to Inventory (+)</SelectItem>
                                            <SelectItem value="remove" className="font-medium text-red-500">Remove Stock (-)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="quantity" className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Quantity</Label>
                                    <Input
                                        id="quantity"
                                        type="number"
                                        min="1"
                                        placeholder="0"
                                        value={adjustmentAmount}
                                        onChange={(e) => setAdjustmentAmount(e.target.value ? parseInt(e.target.value) : "")}
                                        required
                                        className="h-11 bg-gray-50 border-gray-200 font-bold text-lg text-center focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Reason</Label>
                                <Select value={adjustmentReason} onValueChange={setAdjustmentReason}>
                                    <SelectTrigger className="h-11 bg-gray-50 border-gray-200 focus:ring-2 focus:ring-blue-600/20">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {isAdd ? (
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

                            <div className="grid gap-2">
                                <Label htmlFor="notes" className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Notes (Optional)</Label>
                                <Input
                                    id="notes"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Reference number, details, etc."
                                    className="h-11 bg-gray-50 border-gray-200 focus:ring-2 focus:ring-blue-600/20"
                                />
                            </div>

                            <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-100 mt-2">
                                <div className="flex justify-between items-center text-sm mb-1">
                                    <span className="text-gray-600">Current Stock:</span>
                                    <span className="font-semibold text-gray-900">{product?.quantity || 0}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className={isAdd ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                                        {isAdd ? "New Stock Level:" : "New Stock Level:"}
                                    </span>
                                    <span className={`font-bold text-lg ${isAdd ? "text-green-600" : "text-red-600"}`}>
                                        {(product?.quantity || 0) + (isAdd ? (amountValue || 0) : -(amountValue || 0))}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </form>
                </ScrollArea>

                {/* Footer Section with Button */}
                <div className="p-6 border-t bg-white z-10 flex-shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                    <Button
                        type="submit"
                        form="inventory-form"
                        disabled={loading || !isValid}
                        className={`w-full h-12 text-base font-bold text-white transition-all shadow-md active:scale-[0.98] ${
                            isAdd
                                ? "bg-green-500 hover:bg-green-500/90 disabled:bg-gray-200 disabled:text-gray-400 disabled:opacity-100"
                                : "bg-red-500 hover:bg-red-500/90 disabled:bg-gray-200 disabled:text-gray-400 disabled:opacity-100"
                        }`}
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Updating...
                            </div>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                {isAdd ? <Plus className="w-5 h-5" /> : <Minus className="w-5 h-5" />}
                                {isAdd ? "Confirm Add to Inventory" : "Confirm Remove Stock"}
                            </span>
                        )}
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}