"use client";

import { LogOut } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export function MobileHeader() {
    const pathname = usePathname();

    if (pathname === "/login") return null;

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-card/80 backdrop-blur-md md:hidden supports-[backdrop-filter]:bg-card/60">
            <div className="flex h-16 items-center justify-between px-4">
                <div className="relative h-8 w-24">
                    <Image
                        src="/madison-logo.png"
                        alt="Madison Logo"
                        fill
                        className="object-contain object-left"
                        priority
                    />
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground"
                    onClick={() => window.location.href = '/login'}
                >
                    <LogOut className="h-5 w-5" />
                    <span className="sr-only">Sign out</span>
                </Button>
            </div>
        </header>
    );
}
