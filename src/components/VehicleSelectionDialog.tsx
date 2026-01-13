import { useState, useEffect } from "react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from "./ui/sheet";
import { ScrollArea } from "./ui/scroll-area";
import { VehicleSelector, VehicleFilter } from "./VehicleSelector";
import { Button } from "./ui/button";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { cn } from "./ui/utils";

interface VehicleSelectionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onVehicleSelect: (filter: VehicleFilter | null) => void;
    selectedVehicleLabel?: string | null;
}

export function VehicleSelectionDialog({
                                           open,
                                           onOpenChange,
                                           onVehicleSelect,
                                           selectedVehicleLabel
                                       }: VehicleSelectionDialogProps) {
    const [view, setView] = useState<'list' | 'add'>('list');
    const [savedVehicles, setSavedVehicles] = useState<VehicleFilter[]>(() => {
        const saved = localStorage.getItem('myGarage');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('myGarage', JSON.stringify(savedVehicles));
    }, [savedVehicles]);

    useEffect(() => {
        if (open && savedVehicles.length === 0) {
            setView('add');
        } else if (open) {
            setView('list');
        }
    }, [open, savedVehicles.length]);

    const handleAddNew = (filter: VehicleFilter | null) => {
        if (filter) {
            const exists = savedVehicles.some(v => v.label === filter.label);
            if (!exists) {
                const newGarage = [...savedVehicles, filter];
                setSavedVehicles(newGarage);
            }
            onVehicleSelect(filter);
            setView('list');
            onOpenChange(false);
        }
    };

    const handleSelectSaved = (label: string) => {
        const vehicle = savedVehicles.find(v => v.label === label);
        if (vehicle) {
            onVehicleSelect(vehicle);
            onOpenChange(false);
        }
    };

    const removeVehicle = (e: React.MouseEvent, label: string) => {
        e.stopPropagation();
        const newGarage = savedVehicles.filter(v => v.label !== label);
        setSavedVehicles(newGarage);
        if (newGarage.length === 0) setView('add');
        if (selectedVehicleLabel === label) onVehicleSelect(null);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange} modal={true}>
            <SheetContent side="right" className="flex flex-col w-full sm:max-w-md p-0" overlay={true}>
                {/* Header Section */}
                <div className="p-6 border-b bg-white flex-shrink-0">
                    <SheetHeader className="text-left">
                        <div className="flex items-center gap-2">
                            {view === 'add' && savedVehicles.length > 0 && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="-ml-2 h-8 w-8"
                                    onClick={() => setView('list')}
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                </Button>
                            )}
                            <SheetTitle className="text-xl font-bold">
                                {view === 'list' ? 'My Garage' : 'Add Vehicle'}
                            </SheetTitle>
                        </div>
                        <SheetDescription>
                            {view === 'list'
                                ? 'Select a vehicle to verify part fitment.'
                                : 'Enter your vehicle details below.'}
                        </SheetDescription>
                    </SheetHeader>
                </div>

                {/* Scrollable Content */}
                <ScrollArea className="flex-1 bg-white">
                    <div className="p-6">
                        {view === 'list' ? (
                            <div className="space-y-6">
                                <RadioGroup
                                    value={selectedVehicleLabel || ""}
                                    onValueChange={handleSelectSaved}
                                    className="gap-3"
                                >
                                    {savedVehicles.map((vehicle, index) => (
                                        <div
                                            key={index}
                                            className={cn(
                                                "flex items-center justify-between space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-all",
                                                selectedVehicleLabel === vehicle.label
                                                    ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
                                                    : "border-gray-200"
                                            )}
                                            onClick={() => handleSelectSaved(vehicle.label)}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <RadioGroupItem value={vehicle.label} id={vehicle.label} />
                                                <Label htmlFor={vehicle.label} className="font-semibold text-gray-900 cursor-pointer">
                                                    {vehicle.label}
                                                </Label>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full"
                                                onClick={(e) => removeVehicle(e, vehicle.label)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>
                        ) : (
                            <VehicleSelector
                                onVehicleSelect={handleAddNew}
                                className="shadow-none border-0 p-0 mt-0 bg-transparent"
                            />
                        )}
                    </div>
                </ScrollArea>

                {/* Footer Section */}
                {view === 'list' && (
                    <div className="p-6 border-t bg-gray-50/50 flex-shrink-0">
                        <Button
                            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md"
                            onClick={() => setView('add')}
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Add Another Vehicle
                        </Button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}