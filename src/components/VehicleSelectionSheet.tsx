import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "./ui/sheet";
import { ScrollArea } from "./ui/scroll-area";
import { VehicleSelector } from "./VehicleSelector";
import { Separator } from "./ui/separator";

interface VehicleSelectionSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onVehicleSelect: (vehicleId: number | null) => void;
}

export function VehicleSelectionSheet({ open, onOpenChange, onVehicleSelect }: VehicleSelectionSheetProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange} modal={true}>
            <SheetContent side="right" className="flex flex-col w-full sm:max-w-md p-0" overlay={true}>
                {/* Header matching other sheets */}
                <div className="p-6 border-b bg-white">
                    <SheetHeader className="text-left">
                        <SheetTitle className="text-xl font-bold">Check Fitment</SheetTitle>
                        <SheetDescription>
                            To ensure this part fits your car, please select your vehicle details below.
                        </SheetDescription>
                    </SheetHeader>
                </div>

                <ScrollArea className="flex-1 bg-white">
                    <div className="p-6">
                        <div className="space-y-6">
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800">
                                Selecting your vehicle helps us verify that the parts you are buying are compatible.
                            </div>

                            <Separator />

                            {/* Reusing the logic but overriding styles to fit the sheet */}
                            <VehicleSelector
                                onVehicleSelect={(id) => {
                                    onVehicleSelect(id);
                                }}
                                className="shadow-none border-0 p-0 mt-0"
                            />
                        </div>
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}