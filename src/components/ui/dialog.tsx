"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react"; // Changed from XIcon to X

import { cn } from "./utils";

function Dialog({
                    ...props
                }: React.ComponentProps<typeof DialogPrimitive.Root>) {
    return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

const DialogTrigger = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>
>(({ ...props }, ref) => (
    <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} ref={ref} />
));
DialogTrigger.displayName = DialogPrimitive.Trigger.displayName;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Close>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>
>(({ ...props }, ref) => (
    <DialogPrimitive.Close data-slot="dialog-close" {...props} ref={ref} />
));
DialogClose.displayName = DialogPrimitive.Close.displayName;

const DialogOverlay = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay
        data-slot="dialog-overlay"
        ref={ref}
        style={{ zIndex: 1000000 }} // Ultra high z-index
        className={cn(
            "fixed inset-0 bg-black/50 z-[1000000]",
            className,
        )}
        {...props}
    />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
    <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
            data-slot="dialog-content"
            ref={ref}
            style={{ zIndex: 1000001 }} // Higher than overlay
            className={cn(
                "fixed top-[50%] left-[50%] grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border bg-background p-6 shadow-lg z-[1000001] sm:max-w-lg opacity-100 visible",
                className,
            )}
            {...props}
        >
            {children}
            <DialogPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 cursor-pointer">
                <X className="h-4 w-4" /> {/* Changed from XIcon to X */}
                <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
        </DialogPrimitive.Content>
    </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
                          className,
                          ...props
                      }: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        data-slot="dialog-header"
        className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
        {...props}
    />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
                          className,
                          ...props
                      }: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        data-slot="dialog-footer"
        className={cn(
            "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
            className,
        )}
        {...props}
    />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Title
        data-slot="dialog-title"
        ref={ref}
        className={cn("text-lg leading-none font-semibold", className)}
        {...props}
    />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Description
        data-slot="dialog-description"
        ref={ref}
        className={cn("text-muted-foreground text-sm", className)}
        {...props}
    />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
    DialogTrigger,
};