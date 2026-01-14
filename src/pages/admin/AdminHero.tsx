import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Trash2, Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Database } from "../../types/database.types";

type HeroSlide = Database['public']['Tables']['hero_slides']['Row'];

export default function AdminHero() {
    const [slides, setSlides] = useState<HeroSlide[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
            setSelectedFile(null);
            setPreviewUrl(null);
            return;
        }
        const file = e.target.files[0];
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile) {
            toast.error("Please select an image to upload");
            return;
        }

        setUploading(true);
        try {
            const fileExt = selectedFile.name.split('.').pop();
            const fileName = `hero-${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('hero-images')
                .upload(filePath, selectedFile);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('hero-images')
                .getPublicUrl(filePath);

            const { error: dbError } = await supabase
                .from('hero_slides')
                .insert([{
                    title: title,
                    subtitle: subtitle,
                    image_url: publicUrl,
                    is_active: true
                }]);

            if (dbError) throw dbError;

            toast.success("Slide added successfully!");

            setTitle("");
            setSubtitle("");
            setSelectedFile(null);
            setPreviewUrl(null);
            fetchSlides();

        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Error uploading slide");
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
        }
    };

    return (
        <AdminLayout title="Hero Section" description="Manage homepage banners. Upload images to replace the default slides.">
            <div className="grid lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-1 h-fit">
                    <CardHeader>
                        <CardTitle>Add New Slide</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleUpload} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Banner Image</Label>
                                <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    {previewUrl ? (
                                        <div className="relative aspect-video w-full overflow-hidden rounded-md">
                                            <img src={previewUrl} alt="Preview" className="object-cover w-full h-full" />
                                        </div>
                                    ) : (
                                        <div className="py-8 flex flex-col items-center text-gray-400">
                                            <ImageIcon className="w-8 h-8 mb-2" />
                                            <span className="text-sm">Click to upload image</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Title (Optional)</Label>
                                <Input
                                    placeholder="e.g. SUMMER SALE"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Subtitle (Optional)</Label>
                                <Input
                                    placeholder="e.g. 50% Off Selected Items"
                                    value={subtitle}
                                    onChange={e => setSubtitle(e.target.value)}
                                />
                            </div>

                            <Button type="submit" disabled={uploading} className="w-full bg-blue-600 hover:bg-blue-700">
                                {uploading ? (
                                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...</>
                                ) : (
                                    <><Upload className="w-4 h-4 mr-2" /> Publish Slide</>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <Table>
                            <TableHeader className="bg-gray-50">
                                <TableRow>
                                    <TableHead className="w-[100px]">Image</TableHead>
                                    <TableHead>Content</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center py-8">Loading...</TableCell>
                                    </TableRow>
                                ) : slides.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                                            No custom slides found. <br/>
                                            The website is currently showing the <b>3 default slides</b>. <br/>
                                            Upload a new slide to replace them.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    slides.map(slide => (
                                        <TableRow key={slide.id}>
                                            <TableCell>
                                                <div className="w-24 h-14 bg-gray-100 rounded overflow-hidden">
                                                    <img src={slide.image_url} alt="Slide" className="w-full h-full object-cover" />
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-bold text-gray-900">{slide.title || "(No Title)"}</div>
                                                <div className="text-sm text-gray-500">{slide.subtitle}</div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(slide.id)}
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
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