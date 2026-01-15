"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

export function MobileHeader() {
    const pathname = usePathname();

    if (pathname === "/login") return null;

    return (
        <div className="md:hidden flex h-16 items-center justify-center border-b border-border bg-card px-4 sticky top-0 z-40 shadow-sm">
            <div className="relative h-12 w-32">
                <Image
                    src="/madison-logo.png"
                    alt="Madison Logo"
                    fill
                    className="object-contain"
                    priority
                />
            </div>
        </div>
    );
}
