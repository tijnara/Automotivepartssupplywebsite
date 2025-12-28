import { useState, useEffect } from "react";
import { Search, Car, X } from "lucide-react";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { supabase } from "../lib/supabase";
import { Database } from "../types/database.types";

export type Vehicle = Database['public']['Tables']['vehicles']['Row'];

interface VehicleSelectorProps {
    onVehicleSelect: (vehicleId: number | null) => void;
}

export function VehicleSelector({ onVehicleSelect }: VehicleSelectorProps) {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [makes, setMakes] = useState<string[]>([]);
    const [models, setModels] = useState<string[]>([]);

    const [selectedMake, setSelectedMake] = useState<string>("");
    const [selectedModel, setSelectedModel] = useState<string>("");
    const [selectedYear, setSelectedYear] = useState<string>("");

    const [activeVehicleLabel, setActiveVehicleLabel] = useState<string | null>(null);

    useEffect(() => {
        fetchVehicles();
    }, []);

    const fetchVehicles = async () => {
        const { data } = await supabase.from('vehicles').select('*');
        if (data) {
            setVehicles(data);
            const uniqueMakes = Array.from(new Set(data.map(v => v.make))).sort();
            setMakes(uniqueMakes);
        }
    };

    const handleMakeChange = (make: string) => {
        setSelectedMake(make);
        setSelectedModel("");
        setSelectedYear("");

        // Filter models for this make
        const filteredModels = vehicles
            .filter(v => v.make === make)
            .map(v => v.model);
        setModels(Array.from(new Set(filteredModels)).sort());
    };

    const handleSearch = () => {
        if (!selectedMake || !selectedModel) return;

        // Find specific vehicle
        const vehicle = vehicles.find(v => v.make === selectedMake && v.model === selectedModel);

        if (vehicle) {
            onVehicleSelect(vehicle.id);
            setActiveVehicleLabel(`${selectedYear || ''} ${selectedMake} ${selectedModel}`);
        }
    };

    const handleReset = () => {
        setSelectedMake("");
        setSelectedModel("");
        setSelectedYear("");
        setActiveVehicleLabel(null);
        onVehicleSelect(null);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 -mt-10 relative z-20 mx-4 md:mx-auto max-w-5xl">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-blue-900 font-bold uppercase tracking-wider text-sm">
                    <Car className="w-5 h-5" />
                    Select Your Vehicle
                </div>
                {activeVehicleLabel && (
                    <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200">
                        <span>Filtering for: {activeVehicleLabel}</span>
                        <button onClick={handleReset} className="hover:text-green-900"><X className="w-3 h-3" /></button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select value={selectedMake} onValueChange={handleMakeChange}>
                    <SelectTrigger className="h-12">
                        <SelectValue placeholder="Make" />
                    </SelectTrigger>
                    <SelectContent>
                        {makes.map(make => (
                            <SelectItem key={make} value={make}>{make}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={selectedModel}
                    onValueChange={setSelectedModel}
                    disabled={!selectedMake}
                >
                    <SelectTrigger className="h-12">
                        <SelectValue placeholder="Model" />
                    </SelectTrigger>
                    <SelectContent>
                        {models.map(model => (
                            <SelectItem key={model} value={model}>{model}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={selectedYear}
                    onValueChange={setSelectedYear}
                    disabled={!selectedModel}
                >
                    <SelectTrigger className="h-12">
                        <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                        {Array.from({length: 35}, (_, i) => new Date().getFullYear() - i + 1).map(year => (
                            <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Button
                    className="h-12 bg-blue-600 hover:bg-blue-700 font-bold text-base"
                    onClick={handleSearch}
                    disabled={!selectedModel}
                >
                    <Search className="w-5 h-5 mr-2" /> Find Parts
                </Button>
            </div>
        </div>
    );
}