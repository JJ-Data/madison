"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, BarChart3, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav() {
    const pathname = usePathname();

    if (pathname === "/login") return null;

    const links = [
        { href: "/", label: "Home", icon: LayoutDashboard },
        { href: "/inventory", label: "Inv", icon: Package },
        { href: "/analytics", label: "Stats", icon: BarChart3 },
        { href: "/settings", label: "Settings", icon: Settings },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card md:hidden">
            <nav className="flex items-center justify-around h-16 px-2">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full space-y-1",
                                isActive
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Icon className={cn("h-5 w-5", isActive && "fill-current")} />
                            <span className="text-[10px] font-medium">{link.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
