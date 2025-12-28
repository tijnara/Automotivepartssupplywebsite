import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { VehicleSelector } from "./VehicleSelector";

interface VehicleSelectionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onVehicleSelect: (vehicleId: number | null) => void;
}

export function VehicleSelectionDialog({ open, onOpenChange, onVehicleSelect }: VehicleSelectionDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-3xl bg-white p-0 overflow-hidden">
                <DialogHeader className="px-6 pt-6 pb-2">
                    <DialogTitle>Vehicle Check Required</DialogTitle>
                    <DialogDescription>
                        To ensure this part fits your car, please select your vehicle details below.
                    </DialogDescription>
                </DialogHeader>

                <div className="p-6 bg-gray-50">
                    <VehicleSelector
                        onVehicleSelect={(id) => {
                            onVehicleSelect(id);
                        }}
                        className="shadow-none border-0 mt-0"
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}