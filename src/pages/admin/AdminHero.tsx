import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Trash2, Upload, Image as ImageIcon, Loader2, AlignLeft, AlignCenter, AlignRight, Edit, X } from "lucide-react";
import { toast } from "sonner";
import { Database } from "../../types/database.types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "../../components/ui/toggle-group";
import { cn } from "../../components/ui/utils";

type HeroSlide = Database['public']['Tables']['hero_slides']['Row'];

export default function AdminHero() {
    const [slides, setSlides] = useState<HeroSlide[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    // Edit Mode State
    const [editingId, setEditingId] = useState<number | null>(null);

    // Form State
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Style State
    const [titleColor, setTitleColor] = useState("#ffffff");
    const [subtitleColor, setSubtitleColor] = useState("#ffffff");
    const [titleSize, setTitleSize] = useState("large");
    const [subtitleSize, setSubtitleSize] = useState("medium");
    const [textAlign, setTextAlign] = useState("center");

    useEffect(() => {
        fetchSlides();
    }, []);

    const fetchSlides = async () => {
        const { data, error } = await supabase
            .from('hero_slides')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) {
            console.error(error);
            toast.error("Failed to load slides");
        } else {
            setSlides(data || []);
        }
        setLoading(false);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) {
            if (!editingId) {
                setSelectedFile(null);
                setPreviewUrl(null);
            }
            return;
        }
        const file = e.target.files[0];
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleEdit = (slide: HeroSlide) => {
        setEditingId(slide.id);
        setTitle(slide.title || "");
        setSubtitle(slide.subtitle || "");
        setPreviewUrl(slide.image_url);
        setSelectedFile(null);

        // Set Styles
        setTitleColor(slide.title_color || "#ffffff");
        setSubtitleColor(slide.subtitle_color || "#ffffff");
        setTitleSize(slide.title_size || "large");
        setSubtitleSize(slide.subtitle_size || "medium");
        setTextAlign(slide.text_align || "center");

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        resetForm();
    };

    const resetForm = () => {
        setTitle("");
        setSubtitle("");
        setSelectedFile(null);
        setPreviewUrl(null);
        setTitleColor("#ffffff");
        setSubtitleColor("#ffffff");
        setTitleSize("large");
        setSubtitleSize("medium");
        setTextAlign("center");
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!editingId && !selectedFile) {
            toast.error("Please select an image to upload");
            return;
        }

        setUploading(true);
        try {
            let publicUrl = previewUrl;

            // 1. Upload Image
            if (selectedFile) {
                const fileExt = selectedFile.name.split('.').pop();
                const fileName = `hero-${Date.now()}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('hero-images')
                    .upload(filePath, selectedFile);

                if (uploadError) throw uploadError;

                const { data } = supabase.storage
                    .from('hero-images')
                    .getPublicUrl(filePath);

                publicUrl = data.publicUrl;
            }

            const payload = {
                title: title,
                subtitle: subtitle,
                image_url: publicUrl!,
                is_active: true,
                title_color: titleColor,
                title_size: titleSize,
                subtitle_color: subtitleColor,
                subtitle_size: subtitleSize,
                text_align: textAlign
            };

            if (editingId) {
                // UPDATE
                const { error: updateError } = await supabase
                    .from('hero_slides')
                    .update(payload)
                    .eq('id', editingId);

                if (updateError) throw updateError;
                toast.success("Slide updated successfully!");
                setEditingId(null);
            } else {
                // INSERT
                const { error: insertError } = await supabase
                    .from('hero_slides')
                    .insert([payload]);

                if (insertError) throw insertError;
                toast.success("Slide added successfully!");
            }

            resetForm();
            fetchSlides();

        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Error saving slide");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if(!confirm("Delete this slide?")) return;

        const { error } = await supabase.from('hero_slides').delete().eq('id', id);
        if (error) {
            toast.error("Failed to delete");
        } else {
            toast.success("Slide deleted");
            setSlides(prev => prev.filter(s => s.id !== id));
            if (editingId === id) handleCancelEdit();
        }
    };

    return (
        <AdminLayout title="Hero Section" description="Manage homepage banners. Customize text, color, and alignment.">
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Upload Form */}
                <Card className="lg:col-span-1 h-fit sticky top-24">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>{editingId ? "Edit Slide" : "Add New Slide"}</CardTitle>
                        {editingId && (
                            <Button variant="ghost" size="icon" onClick={handleCancelEdit} title="Cancel Edit">
                                <X className="w-4 h-4" />
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="space-y-2">
                                <Label>Banner Image</Label>
                                {/* Added cursor-pointer, flex center alignment */}
                                <label
                                    className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors relative cursor-pointer min-h-[200px]"
                                >
                                    {previewUrl ? (
                                        <div className="relative w-full aspect-video overflow-hidden rounded-md mb-4">
                                            <img src={previewUrl} alt="Preview" className="object-cover w-full h-full" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-medium">
                                                Click to Change
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <ImageIcon className="w-8 h-8 mb-3 text-gray-400" />
                                            <span className="text-sm font-medium text-gray-600 mb-2">Click to Upload Image</span>
                                        </>
                                    )}

                                    {/* Visible Input positioned below text/preview */}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                        className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer mx-auto"
                                    />
                                </label>
                            </div>

                            <div className="space-y-4 border-t pt-4">
                                <div className="space-y-2">
                                    <Label>Title</Label>
                                    <Input
                                        placeholder="e.g. SUMMER SALE"
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-1">
                                        <Label className="text-xs text-gray-500">Color</Label>
                                        <div className="flex gap-2 items-center">
                                            <Input
                                                type="color"
                                                className="w-10 h-10 p-1 rounded-md cursor-pointer"
                                                value={titleColor}
                                                onChange={e => setTitleColor(e.target.value)}
                                            />
                                            <span className="text-xs text-gray-500 uppercase">{titleColor}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-gray-500">Size</Label>
                                        <Select value={titleSize} onValueChange={setTitleSize}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="small">Small</SelectItem>
                                                <SelectItem value="medium">Medium</SelectItem>
                                                <SelectItem value="large">Large</SelectItem>
                                                <SelectItem value="xl">Extra Large</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 border-t pt-4">
                                <div className="space-y-2">
                                    <Label>Subtitle</Label>
                                    <Input
                                        placeholder="e.g. 50% Off Selected Items"
                                        value={subtitle}
                                        onChange={e => setSubtitle(e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-1">
                                        <Label className="text-xs text-gray-500">Color</Label>
                                        <div className="flex gap-2 items-center">
                                            <Input
                                                type="color"
                                                className="w-10 h-10 p-1 rounded-md cursor-pointer"
                                                value={subtitleColor}
                                                onChange={e => setSubtitleColor(e.target.value)}
                                            />
                                            <span className="text-xs text-gray-500 uppercase">{subtitleColor}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-gray-500">Size</Label>
                                        <Select value={subtitleSize} onValueChange={setSubtitleSize}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="small">Small</SelectItem>
                                                <SelectItem value="medium">Medium</SelectItem>
                                                <SelectItem value="large">Large</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 border-t pt-4">
                                <Label>Text Alignment</Label>
                                <ToggleGroup type="single" value={textAlign} onValueChange={(val) => val && setTextAlign(val)} className="justify-start border rounded-md p-1 bg-gray-50">
                                    <ToggleGroupItem
                                        value="left"
                                        aria-label="Left"
                                        className={cn(
                                            "hover:bg-gray-200 transition-colors",
                                            textAlign === "left" ? "!bg-blue-600 !text-white hover:!bg-blue-700" : "text-gray-600"
                                        )}
                                    >
                                        <AlignLeft className="w-4 h-4" />
                                    </ToggleGroupItem>
                                    <ToggleGroupItem
                                        value="center"
                                        aria-label="Center"
                                        className={cn(
                                            "hover:bg-gray-200 transition-colors",
                                            textAlign === "center" ? "!bg-blue-600 !text-white hover:!bg-blue-700" : "text-gray-600"
                                        )}
                                    >
                                        <AlignCenter className="w-4 h-4" />
                                    </ToggleGroupItem>
                                    <ToggleGroupItem
                                        value="right"
                                        aria-label="Right"
                                        className={cn(
                                            "hover:bg-gray-200 transition-colors",
                                            textAlign === "right" ? "!bg-blue-600 !text-white hover:!bg-blue-700" : "text-gray-600"
                                        )}
                                    >
                                        <AlignRight className="w-4 h-4" />
                                    </ToggleGroupItem>
                                </ToggleGroup>
                            </div>

                            <div className="flex gap-2 pt-2">
                                {editingId && (
                                    <Button type="button" variant="outline" onClick={handleCancelEdit} className="flex-1">
                                        Cancel
                                    </Button>
                                )}
                                <Button type="submit" disabled={uploading} className="flex-1 bg-blue-600 hover:bg-blue-700">
                                    {uploading ? (
                                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {editingId ? "Updating..." : "Uploading..."}</>
                                    ) : (
                                        <><Upload className="w-4 h-4 mr-2" /> {editingId ? "Update Slide" : "Publish Slide"}</>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Slides List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <Table>
                            <TableHeader className="bg-gray-50">
                                <TableRow>
                                    <TableHead className="w-[120px]">Image</TableHead>
                                    <TableHead>Content Preview</TableHead>
                                    <TableHead>Alignment</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8">Loading...</TableCell>
                                    </TableRow>
                                ) : slides.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                            No custom slides found. Default slides active.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    slides.map(slide => (
                                        <TableRow key={slide.id} className={editingId === slide.id ? "bg-blue-50/50 transition-colors" : "transition-colors"}>
                                            <TableCell>
                                                <div className="w-24 h-14 bg-gray-100 rounded overflow-hidden shadow-sm border border-gray-200">
                                                    <img src={slide.image_url} alt="Slide" className="w-full h-full object-cover" />
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    <span
                                                        className="font-bold text-gray-900"
                                                        style={{ color: slide.title_color || '#000' }}
                                                    >
                                                        {slide.title || "(No Title)"}
                                                    </span>
                                                    <span
                                                        className="text-sm text-gray-500"
                                                        style={{ color: slide.subtitle_color || '#666' }}
                                                    >
                                                        {slide.subtitle}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="capitalize text-gray-600">{slide.text_align || 'Center'}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleEdit(slide)}
                                                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                                        title="Edit Slide"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(slide.id)}
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                        title="Delete Slide"
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
                </div>
            </div>
        </AdminLayout>
    );
}