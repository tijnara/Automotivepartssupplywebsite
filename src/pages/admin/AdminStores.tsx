import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "../../components/ui/sheet";
import { Plus, Edit2, Trash2, Loader2, Store } from "lucide-react";
import { toast } from "sonner";
import { Database } from "../../types/database.types";
import { Checkbox } from "../../components/ui/checkbox";
import { ScrollArea } from "../../components/ui/scroll-area";

type Store = Database['public']['Tables']['stores']['Row'];
type StoreInsert = Database['public']['Tables']['stores']['Insert'];

export default function AdminStores() {
    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Form State
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState<StoreInsert>({
        name: "",
        address: "",
        phone: "",
        email: "",
        hours: "Mon-Sat: 8am - 6pm",
        map_url: "",
        is_active: true
    });

    useEffect(() => {
        fetchStores();
    }, []);

    const fetchStores = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('stores')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) {
            toast.error("Failed to fetch stores");
        } else {
            setStores(data || []);
        }
        setLoading(false);
    };

    const handleOpenSheet = (store?: Store) => {
        if (store) {
            setEditingId(store.id);
            setFormData({
                name: store.name,
                address: store.address,
                phone: store.phone,
                email: store.email,
                hours: store.hours,
                map_url: store.map_url,
                is_active: store.is_active
            });
        } else {
            setEditingId(null);
            setFormData({
                name: "",
                address: "",
                phone: "",
                email: "",
                hours: "Mon-Sat: 8am - 6pm",
                map_url: "",
                is_active: true
            });
        }
        setIsSheetOpen(true);
    };

    // UPDATED SMART PASTE LOGIC
    const handleMapUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        // Regex to extract URL from src="..." or src='...'
        const srcMatch = value.match(/src=["']([^"']+)["']/);

        if (srcMatch && srcMatch[1]) {
            value = srcMatch[1];
            toast.info("Auto-extracted URL from iframe code");
        }
        setFormData({ ...formData, map_url: value });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            if (editingId) {
                const { error } = await supabase
                    .from('stores')
                    .update(formData)
                    .eq('id', editingId);
                if (error) throw error;
                toast.success("Store updated successfully");
            } else {
                const { error } = await supabase
                    .from('stores')
                    .insert([formData]);
                if (error) throw error;
                toast.success("Store added successfully");
            }
            setIsSheetOpen(false);
            fetchStores();
        } catch (error: any) {
            toast.error(error.message || "Error saving store");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this store location?")) return;

        const { error } = await supabase.from('stores').delete().eq('id', id);
        if (error) {
            toast.error("Failed to delete store");
        } else {
            toast.success("Store deleted");
            setStores(prev => prev.filter(s => s.id !== id));
        }
    };

    return (
        <AdminLayout
            title="Store Locator"
            description="Manage your physical store locations."
        >
            <div className="flex justify-end mb-6">
                <Button onClick={() => handleOpenSheet()} className="bg-blue-600 hover:bg-blue-700 font-bold shadow-md cursor-pointer">
                    <Plus className="w-4 h-4 mr-2" /> Add New Store
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50/80">
                        <TableRow>
                            <TableHead className="font-bold text-gray-700">Store Name</TableHead>
                            <TableHead className="font-bold text-gray-700">Address</TableHead>
                            <TableHead className="font-bold text-gray-700">Contact</TableHead>
                            <TableHead className="text-center font-bold text-gray-700">Status</TableHead>
                            <TableHead className="text-right font-bold text-gray-700">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10">Loading...</TableCell>
                            </TableRow>
                        ) : stores.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                                    No stores found. Add one to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            stores.map((store) => (
                                <TableRow key={store.id} className="group hover:bg-gray-50 transition-colors">
                                    <TableCell className="font-medium text-gray-900">
                                        <div className="flex items-center gap-2">
                                            <Store className="w-4 h-4 text-blue-500" />
                                            {store.name}
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-xs truncate text-gray-600" title={store.address}>
                                        {store.address}
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-600">
                                        <div>{store.phone || "-"}</div>
                                        <div className="text-xs text-gray-400">{store.email}</div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            store.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {store.is_active ? 'Active' : 'Hidden'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-blue-600 hover:bg-blue-50 cursor-pointer"
                                                onClick={() => handleOpenSheet(store)}
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-red-500 hover:bg-red-50 cursor-pointer"
                                                onClick={() => handleDelete(store.id)}
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

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col" overlay={true}>
                    <div className="p-6 border-b bg-white">
                        <SheetHeader className="text-left">
                            <SheetTitle>{editingId ? "Edit Store" : "Add Store"}</SheetTitle>
                            <SheetDescription>
                                Enter the details for this store location.
                            </SheetDescription>
                        </SheetHeader>
                    </div>

                    <ScrollArea className="flex-1 px-6">
                        <form id="store-form" onSubmit={handleSave} className="py-6 space-y-6">
                            <div className="space-y-3">
                                <Label htmlFor="name">Store Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    placeholder="e.g. AutoParts PH - Quezon City"
                                    required
                                />
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="address">Full Address</Label>
                                <Textarea
                                    id="address"
                                    value={formData.address}
                                    onChange={e => setFormData({...formData, address: e.target.value})}
                                    placeholder="Complete street address..."
                                    required
                                    className="min-h-[80px]"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        value={formData.phone || ""}
                                        onChange={e => setFormData({...formData, phone: e.target.value})}
                                        placeholder="+63 2 ..."
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        value={formData.email || ""}
                                        onChange={e => setFormData({...formData, email: e.target.value})}
                                        placeholder="store@autoparts.ph"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="hours">Business Hours</Label>
                                <Input
                                    id="hours"
                                    value={formData.hours || ""}
                                    onChange={e => setFormData({...formData, hours: e.target.value})}
                                    placeholder="e.g. Mon-Sat: 8:00 AM - 6:00 PM"
                                />
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="map_url">Google Maps Embed URL</Label>
                                <Input
                                    id="map_url"
                                    value={formData.map_url || ""}
                                    onChange={handleMapUrlChange}
                                    placeholder="Paste URL or full iframe code here..."
                                />
                                <p className="text-xs text-gray-500">
                                    Go to Google Maps &gt; Share &gt; Embed a map. Paste the code here.
                                </p>
                            </div>

                            <div className="flex items-center space-x-2 pt-2">
                                <Checkbox
                                    id="is_active"
                                    checked={formData.is_active || false}
                                    onCheckedChange={(checked) => setFormData({...formData, is_active: checked as boolean})}
                                />
                                <Label htmlFor="is_active" className="cursor-pointer">Visible to public</Label>
                            </div>
                        </form>
                    </ScrollArea>

                    <div className="p-6 border-t bg-gray-50">
                        <Button
                            type="submit"
                            form="store-form"
                            disabled={isSaving}
                            className="w-full bg-blue-600 hover:bg-blue-700 font-bold cursor-pointer"
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Store"}
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>
        </AdminLayout>
    );
}