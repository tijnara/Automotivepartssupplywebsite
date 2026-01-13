import { useState, useEffect } from "react";
import { Search, Car, X, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { supabase } from "../lib/supabase";
import { Database } from "../types/database.types";
import { cn } from "./ui/utils";
import { toast } from "sonner";

export type Vehicle = Database['public']['Tables']['vehicles']['Row'];

// Fix: Export this interface so PublicShop can use it
export interface VehicleFilter {
    vehicleId?: number;
    make?: string;
    model?: string;
    year?: string;
    label: string;
}

interface VehicleSelectorProps {
    // Fix: Update type to accept the Filter object instead of just ID
    onVehicleSelect: (filter: VehicleFilter | null) => void;
    className?: string;
}

export function VehicleSelector({ onVehicleSelect, className }: VehicleSelectorProps) {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [makes, setMakes] = useState<string[]>([]);
    const [models, setModels] = useState<string[]>([]);
    const [years, setYears] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Selection States
    const [selectedMake, setSelectedMake] = useState<string>("");
    const [selectedModel, setSelectedModel] = useState<string>("");
    const [selectedYear, setSelectedYear] = useState<string>("");

    const [activeLabel, setActiveLabel] = useState<string | null>(null);

    useEffect(() => {
        fetchVehicles();
    }, []);

    const fetchVehicles = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('vehicles')
                .select('*')
                .returns<Vehicle[]>();

            if (error) {
                console.error("Error loading vehicles:", error);
                return;
            }

            if (data) {
                setVehicles(data);
                const uniqueMakes = Array.from(new Set(data.map(v => v.make))).sort();
                setMakes(uniqueMakes);
            }
        } catch (error) {
            console.error("Unexpected error loading vehicles:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMakeChange = (make: string) => {
        setSelectedMake(make);
        setSelectedModel("");
        setSelectedYear("");
        setYears([]);

        const filteredModels = vehicles
            .filter(v => v.make === make)
            .map(v => v.model);
        setModels(Array.from(new Set(filteredModels)).sort());
    };

    const handleModelChange = (model: string) => {
        setSelectedModel(model);
        setSelectedYear("");

        const relevantVehicles = vehicles.filter(v => v.make === selectedMake && v.model === model);
        const validYears = new Set<string>();
        relevantVehicles.forEach(v => {
            const start = v.year_start;
            const end = v.year_end || new Date().getFullYear();
            for (let y = start; y <= end; y++) {
                validYears.add(y.toString());
            }
        });

        setYears(Array.from(validYears).sort((a, b) => Number(b) - Number(a)));
    };

    const handleSearch = () => {
        if (!selectedMake) {
            toast.warning("Please select at least a Vehicle Make.");
            return;
        }

        let filter: VehicleFilter = {
            make: selectedMake,
            model: selectedModel || undefined,
            year: selectedYear || undefined,
            label: `${selectedMake}`
        };

        if (selectedModel) filter.label += ` ${selectedModel}`;
        if (selectedYear) filter.label = `${selectedYear} ${filter.label}`;

        if (selectedMake && selectedModel && selectedYear) {
            const yearNum = parseInt(selectedYear);
            const exactVehicle = vehicles.find(v =>
                v.make === selectedMake &&
                v.model === selectedModel &&
                v.year_start <= yearNum &&
                (v.year_end === null || v.year_end >= yearNum)
            );
            if (exactVehicle) {
                filter.vehicleId = exactVehicle.id;
            }
        }

        setActiveLabel(filter.label);
        onVehicleSelect(filter);
    };

    const handleReset = () => {
        setSelectedMake("");
        setSelectedModel("");
        setSelectedYear("");
        setActiveLabel(null);
        setModels([]);
        setYears([]);
        onVehicleSelect(null);
    };

    return (
        <div className={cn(
            "bg-white p-6 rounded-xl shadow-lg border border-gray-100",
            className
        )}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-blue-900 font-bold uppercase tracking-wider text-sm">
                    <Car className="w-5 h-5" />
                    Select Your Vehicle
                </div>
                {activeLabel && (
                    <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200">
                        <span>{activeLabel}</span>
                        <button onClick={handleReset} className="hover:text-green-900 cursor-pointer"><X className="w-3 h-3" /></button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="w-full">
                    <Select value={selectedMake || undefined} onValueChange={handleMakeChange}>
                        <SelectTrigger className="h-12 w-full bg-white border-gray-300">
                            <SelectValue placeholder={isLoading ? "Loading..." : "Select Make"} />
                        </SelectTrigger>
                        <SelectContent>
                            {makes.map(make => (
                                <SelectItem key={make} value={make}>{make}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="w-full">
                    <Select
                        value={selectedModel || undefined}
                        onValueChange={handleModelChange}
                        disabled={!selectedMake}
                    >
                        <SelectTrigger className="h-12 w-full bg-white border-gray-300">
                            <SelectValue placeholder="Select Model" />
                        </SelectTrigger>
                        <SelectContent>
                            {models.map(model => (
                                <SelectItem key={model} value={model}>{model}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="w-full">
                    <Select
                        value={selectedYear || undefined}
                        onValueChange={setSelectedYear}
                        disabled={!selectedModel}
                    >
                        <SelectTrigger className="h-12 w-full bg-white border-gray-300">
                            <SelectValue placeholder="Select Year" />
                        </SelectTrigger>
                        <SelectContent>
                            {years.map(year => (
                                <SelectItem key={year} value={year}>{year}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="w-full">
                    <Button
                        className="h-12 w-full bg-blue-600 hover:bg-blue-700 font-bold text-base shadow-md transition-all active:scale-95"
                        onClick={handleSearch}
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5 mr-2" />}
                        Find Parts
                    </Button>
                </div>
            </div>
        </div>
    );
}