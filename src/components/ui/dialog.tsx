"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: React.ReactNode;
}

export function Dialog({ isOpen, onClose, title, description, children }: DialogProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-all md:p-4">
            <div className="relative w-full max-w-lg overflow-hidden rounded-xl border border-border/50 bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="flex flex-col space-y-1.5 text-center sm:text-left">
                    <h2 className="text-lg font-semibold leading-none tracking-tight text-foreground">
                        {title}
                    </h2>
                    {description && (
                        <p className="text-sm text-muted-foreground">
                            {description}
                        </p>
                    )}
                </div>
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </button>
                <div className="mt-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
