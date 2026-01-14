import Link from "next/link";
import Image from "next/image"; // Next.js Image component
import { LayoutDashboard, Package, BarChart3, Settings, LogOut } from "lucide-react"; // These will be available after install

export function Sidebar() {
    return (
        <div className="hidden h-screen w-64 flex-col border-r bg-card text-card-foreground md:flex">
            <div className="flex h-20 items-center border-b px-6">
                <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-md border border-border/50">
                        {/* Using the copied logo */}
                        <Image src="/logo.png" alt="Madison Logo" fill className="object-cover" />
                    </div>
                    <span className="text-lg font-bold tracking-tight">Madison</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto py-6">
                <nav className="grid items-start px-4 text-sm font-medium">
                    <Link
                        href="/"
                        className="flex items-center gap-3 rounded-lg bg-primary/10 px-3 py-2.5 text-primary transition-all hover:bg-primary/20"
                    >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                    </Link>
                    <Link
                        href="/inventory"
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground transition-all hover:text-primary"
                    >
                        <Package className="h-4 w-4" />
                        Inventory
                    </Link>
                    <Link
                        href="/analytics"
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground transition-all hover:text-primary"
                    >
                        <BarChart3 className="h-4 w-4" />
                        Analytics
                    </Link>
                    <Link
                        href="/settings"
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground transition-all hover:text-primary"
                    >
                        <Settings className="h-4 w-4" />
                        Settings
                    </Link>
                </nav>
            </div>

            <div className="border-t p-4">
                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:text-destructive">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                </button>
            </div>
        </div>
    );
}
