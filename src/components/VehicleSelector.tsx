import { useState, useEffect } from "react";
import { Search, Car, X, Loader2, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { supabase } from "../lib/supabase";
import { Database } from "../types/database.types";
import { cn } from "./ui/utils";

// Explicitly use the type from Database definition
export type Vehicle = Database['public']['Tables']['vehicles']['Row'];

interface VehicleSelectorProps {
    onVehicleSelect: (vehicle: Vehicle | null) => void; // Changed from ID to full Object
    className?: string;
}

export function VehicleSelector({ onVehicleSelect, className }: VehicleSelectorProps) {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [makes, setMakes] = useState<string[]>([]);
    const [models, setModels] = useState<string[]>([]);
    const [years, setYears] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Selection States
    const [selectedMake, setSelectedMake] = useState<string>("");
    const [selectedModel, setSelectedModel] = useState<string>("");
    const [selectedYear, setSelectedYear] = useState<string>("");

    const [activeVehicleLabel, setActiveVehicleLabel] = useState<string | null>(null);

    useEffect(() => {
        fetchVehicles();
    }, []);

    const fetchVehicles = async () => {
        setIsLoading(true);
        setError(null);
        try {
            console.log("Fetching vehicles...");
            const { data, error } = await supabase
                .from('vehicles')
                .select('*');

            if (error) {
                console.error("Supabase Error:", error);
                setError("Failed to load vehicle data.");
                return;
            }

            if (!data || data.length === 0) {
                console.warn("No vehicles found in database table.");
                setError("No vehicle data found.");
                return;
            }

            setVehicles(data as Vehicle[]);

            // Extract unique makes
            const uniqueMakes = Array.from(new Set(data.map((v: any) => v.make))).sort();
            setMakes(uniqueMakes);
        } catch (err) {
            console.error("Unexpected error:", err);
            setError("An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleMakeChange = (make: string) => {
        setSelectedMake(make);
        setSelectedModel("");
        setSelectedYear("");
        setModels([]);
        setYears([]);

        // Filter models for this make
        const filteredModels = vehicles
            .filter(v => v.make === make)
            .map(v => v.model);
        setModels(Array.from(new Set(filteredModels)).sort());
    };

    const handleModelChange = (model: string) => {
        setSelectedModel(model);
        setSelectedYear("");

        // Find valid years for this Make + Model
        const relevantVehicles = vehicles.filter(v => v.make === selectedMake && v.model === model);

        const validYears = new Set<string>();
        relevantVehicles.forEach(v => {
            const start = v.year_start;
            const end = v.year_end || new Date().getFullYear();
            for (let y = start; y <= end; y++) {
                validYears.add(y.toString());
            }
        });

        // Sort years descending (newest first)
        setYears(Array.from(validYears).sort((a, b) => Number(b) - Number(a)));
    };

    const handleSearch = () => {
        if (!selectedMake || !selectedModel || !selectedYear) return;

        const yearNum = parseInt(selectedYear);
        const vehicle = vehicles.find(v =>
            v.make === selectedMake &&
            v.model === selectedModel &&
            v.year_start <= yearNum &&
            (v.year_end === null || v.year_end >= yearNum)
        );

        if (vehicle) {
            // Updated: Pass full object
            onVehicleSelect(vehicle);
            setActiveVehicleLabel(`${selectedYear} ${selectedMake} ${selectedModel}`);
        } else {
            console.warn("No matching vehicle ID found for selection");
        }
    };

    const handleReset = () => {
        setSelectedMake("");
        setSelectedModel("");
        setSelectedYear("");
        setModels([]);
        setYears([]);
        setActiveVehicleLabel(null);
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
                {activeVehicleLabel && (
                    <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200">
                        <span>{activeVehicleLabel}</span>
                        <button onClick={handleReset} className="hover:text-green-900 cursor-pointer"><X className="w-3 h-3" /></button>
                    </div>
                )}
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                {/* Make Selector */}
                <div className="w-full">
                    <Select value={selectedMake || undefined} onValueChange={handleMakeChange}>
                        <SelectTrigger className="h-12 w-full bg-white border-gray-300 focus:ring-blue-500">
                            <SelectValue placeholder={isLoading ? "Loading..." : "Select Make"} />
                        </SelectTrigger>
                        <SelectContent>
                            {makes.length === 0 && !isLoading ? (
                                <SelectItem value="none" disabled>No Data</SelectItem>
                            ) : (
                                makes.map(make => (
                                    <SelectItem key={make} value={make}>{make}</SelectItem>
                                ))
                            )}
                        </SelectContent>
                    </Select>
                </div>

                {/* Model Selector */}
                <div className="w-full">
                    <Select
                        value={selectedModel || undefined}
                        onValueChange={handleModelChange}
                        disabled={!selectedMake || models.length === 0}
                    >
                        <SelectTrigger className="h-12 w-full bg-white border-gray-300 focus:ring-blue-500">
                            <SelectValue placeholder="Select Model" />
                        </SelectTrigger>
                        <SelectContent>
                            {models.map(model => (
                                <SelectItem key={model} value={model}>{model}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Year Selector */}
                <div className="w-full">
                    <Select
                        value={selectedYear || undefined}
                        onValueChange={setSelectedYear}
                        disabled={!selectedModel || years.length === 0}
                    >
                        <SelectTrigger className="h-12 w-full bg-white border-gray-300 focus:ring-blue-500">
                            <SelectValue placeholder="Select Year" />
                        </SelectTrigger>
                        <SelectContent>
                            {years.map(year => (
                                <SelectItem key={year} value={year}>{year}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Search Button */}
                <div className="w-full">
                    <Button
                        className="h-12 w-full bg-blue-600 hover:bg-blue-700 font-bold text-base shadow-md transition-all active:scale-95"
                        onClick={handleSearch}
                        disabled={!selectedYear}
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5 mr-2" />}
                        Find Parts
                    </Button>
                </div>
            </div>
        </div>
    );
}