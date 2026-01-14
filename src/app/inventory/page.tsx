"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { inventoryStorage, InventoryItem, INITIAL_INVENTORY } from "@/lib/storage";
import { Plus, Minus, Search, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setItems(inventoryStorage.getAll());
  }, []);

  const handleUpdateStock = (id: string, change: number) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    const newQuantity = Math.max(0, item.quantity + change);
    const updated = inventoryStorage.update(id, { quantity: newQuantity });
    setItems(updated);
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!mounted) return <div className="p-8">Loading...</div>;

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground">Manage real-time stock levels.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredItems.map((item) => (
          <Card key={item.id} className={cn("overflow-hidden transition-all hover:shadow-lg border-border/50 bg-card/50", item.quantity <= item.minStock && "border-destructive/50 ring-1 ring-destructive/20")}>
            <div className="p-0">
              <div className="flex items-start justify-between p-6 pb-2">
                <div>
                  <h3 className="font-semibold tracking-tight text-lg">{item.name}</h3>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">{item.category}</span>
                </div>
                {item.quantity <= item.minStock && (
                  <AlertTriangle className="h-5 w-5 text-destructive animate-pulse" />
                )}
              </div>

              <div className="p-6 pt-2">
                <div className="flex items-end justify-between mb-4">
                  <div className="space-y-1">
                    <div className="text-3xl font-bold font-mono">{item.quantity}</div>
                    <div className="text-xs text-muted-foreground">{item.unit}</div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="text-sm font-medium opacity-80">₦{item.price.toLocaleString()}</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden mb-4">
                  <div
                    className={cn("h-full transition-all duration-500", item.quantity <= item.minStock ? "bg-destructive" : "bg-primary")}
                    style={{ width: `${Math.min((item.quantity / (item.minStock * 3)) * 100, 100)}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="h-12 border-primary/20 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
                    onClick={() => handleUpdateStock(item.id, -1)}
                  >
                    <Minus className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="default" // Using default primary color
                    className="h-12 shadow-md shadow-primary/20 active:translate-y-0.5 transition-transform"
                    onClick={() => handleUpdateStock(item.id, 1)}
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
        {filteredItems.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            No items found matching "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  );
}
