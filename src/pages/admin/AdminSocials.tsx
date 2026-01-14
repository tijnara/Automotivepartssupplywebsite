import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "../../components/ui/sheet";
import { Plus, Edit2, Trash2, Loader2, Facebook, Instagram, Twitter, Youtube, Linkedin, Globe } from "lucide-react";
import { toast } from "sonner";
import { Database } from "../../types/database.types";
import { Checkbox } from "../../components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { ScrollArea } from "../../components/ui/scroll-area";

type SocialMedia = Database['public']['Tables']['social_media']['Row'];
type SocialMediaInsert = Database['public']['Tables']['social_media']['Insert'];

const PLATFORMS = [
    { value: "Facebook", label: "Facebook", icon: Facebook },
    { value: "Instagram", label: "Instagram", icon: Instagram },
    { value: "Twitter", label: "Twitter / X", icon: Twitter },
    { value: "Youtube", label: "YouTube", icon: Youtube },
    { value: "LinkedIn", label: "LinkedIn", icon: Linkedin },
    { value: "TikTok", label: "TikTok", icon: Globe },
    { value: "Other", label: "Other Website", icon: Globe },
];

// Helper: Ensure URL is absolute so it redirects externally
const ensureAbsoluteUrl = (url: string) => {
    if (!url) return '#';
    if (url.startsWith('mailto:') || url.match(/^https?:\/\//i)) {
        return url;
    }
    return `https://${url}`;
};

export default function AdminSocials() {
    const [socials, setSocials] = useState<SocialMedia[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Form State
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState<SocialMediaInsert>({
        platform: "Facebook",
        url: "",
        is_active: true
    });

    useEffect(() => {
        fetchSocials();
    }, []);

    const fetchSocials = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('social_media')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) {
            toast.error("Failed to fetch social media links");
        } else {
            setSocials(data || []);
        }
        setLoading(false);
    };

    const handleOpenSheet = (social?: SocialMedia) => {
        if (social) {
            setEditingId(social.id);
            setFormData({
                platform: social.platform,
                url: social.url,
                is_active: social.is_active
            });
        } else {
            setEditingId(null);
            setFormData({
                platform: "Facebook",
                url: "",
                is_active: true
            });
        }
        setIsSheetOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            if (editingId) {
                const { error } = await supabase
                    .from('social_media')
                    .update(formData)
                    .eq('id', editingId);
                if (error) throw error;
                toast.success("Link updated successfully");
            } else {
                const { error } = await supabase
                    .from('social_media')
                    .insert([formData]);
                if (error) throw error;
                toast.success("Link added successfully");
            }
            setIsSheetOpen(false);
            fetchSocials();
        } catch (error: any) {
            toast.error(error.message || "Error saving link");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this social media link?")) return;

        const { error } = await supabase.from('social_media').delete().eq('id', id);
        if (error) {
            toast.error("Failed to delete");
        } else {
            toast.success("Deleted successfully");
            setSocials(prev => prev.filter(s => s.id !== id));
        }
    };

    const getIcon = (platformName: string) => {
        const p = PLATFORMS.find(p => p.value === platformName);
        const Icon = p ? p.icon : Globe;
        return <Icon className="w-4 h-4" />;
    };

    return (
        <AdminLayout
            title="Social Media"
            description="Manage social media links displayed in the footer."
        >
            <div className="flex justify-end mb-6">
                <Button onClick={() => handleOpenSheet()} className="bg-blue-600 hover:bg-blue-700 font-bold shadow-md cursor-pointer">
                    <Plus className="w-4 h-4 mr-2" /> Add Social Link
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50/80">
                        <TableRow>
                            <TableHead className="font-bold text-gray-700">Platform</TableHead>
                            <TableHead className="font-bold text-gray-700">URL</TableHead>
                            <TableHead className="text-center font-bold text-gray-700">Status</TableHead>
                            <TableHead className="text-right font-bold text-gray-700">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-10">Loading...</TableCell>
                            </TableRow>
                        ) : socials.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-10 text-gray-500">
                                    No social links found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            socials.map((item) => (
                                <TableRow key={item.id} className="group hover:bg-gray-50 transition-colors">
                                    <TableCell className="font-medium text-gray-900">
                                        <div className="flex items-center gap-2">
                                            {getIcon(item.platform)}
                                            {item.platform}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-gray-600 max-w-xs truncate" title={item.url}>
                                        <a
                                            href={ensureAbsoluteUrl(item.url)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="hover:text-blue-600 hover:underline"
                                        >
                                            {item.url}
                                        </a>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            item.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {item.is_active ? 'Active' : 'Hidden'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-blue-600 hover:bg-blue-50 cursor-pointer"
                                                onClick={() => handleOpenSheet(item)}
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-red-500 hover:bg-red-50 cursor-pointer"
                                                onClick={() => handleDelete(item.id)}
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
                            <SheetTitle>{editingId ? "Edit Link" : "Add Link"}</SheetTitle>
                            <SheetDescription>
                                Manage your social media presence.
                            </SheetDescription>
                        </SheetHeader>
                    </div>

                    <ScrollArea className="flex-1 px-6">
                        <form id="social-form" onSubmit={handleSave} className="py-6 space-y-6">
                            <div className="space-y-3">
                                <Label>Platform</Label>
                                <Select
                                    value={formData.platform}
                                    onValueChange={(val) => setFormData({ ...formData, platform: val })}
                                >
                                    <SelectTrigger className="h-11">
                                        <SelectValue placeholder="Select Platform" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PLATFORMS.map((p) => (
                                            <SelectItem key={p.value} value={p.value} className="cursor-pointer">
                                                <div className="flex items-center gap-2">
                                                    <p.icon className="w-4 h-4" /> {p.label}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="url">Profile URL</Label>
                                <Input
                                    id="url"
                                    value={formData.url}
                                    onChange={e => setFormData({ ...formData, url: e.target.value })}
                                    placeholder="facebook.com/autopartsph"
                                    required
                                />
                                <p className="text-xs text-gray-500">
                                    Format: <strong>https://example.com</strong> or just <strong>example.com</strong>
                                </p>
                            </div>

                            <div className="flex items-center space-x-2 pt-2">
                                <Checkbox
                                    id="is_active"
                                    checked={formData.is_active || false}
                                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked as boolean })}
                                />
                                <Label htmlFor="is_active" className="cursor-pointer">Visible in Footer</Label>
                            </div>
                        </form>
                    </ScrollArea>

                    <div className="p-6 border-t bg-gray-50">
                        <Button
                            type="submit"
                            form="social-form"
                            disabled={isSaving}
                            className="w-full bg-blue-600 hover:bg-blue-700 font-bold cursor-pointer"
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Link"}
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>
        </AdminLayout>
    );
}