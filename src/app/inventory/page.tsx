"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { inventoryStorage, InventoryItem, Category, historyStorage, TransactionType } from "@/lib/storage";
import { Plus, Search, Edit2, Trash2, AlertTriangle, Check, Flame, Filter, MinusCircle, PlusCircle, History } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog } from "@/components/ui/dialog";

const CATEGORIES: Category[] = ["Spices", "Vegetables", "Meat", "Wines", "Dry Goods", "Dairy", "Other"];

export default function InventoryPage() {
  // Inventory State
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Transaction State
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [transactionAmount, setTransactionAmount] = useState<number>(1);
  const [isUseDialogOpen, setIsUseDialogOpen] = useState(false);
  const [isRestockDialogOpen, setIsRestockDialogOpen] = useState(false);

  // Form State
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState<Partial<InventoryItem>>({
    name: "",
    category: "Other",
    quantity: 0,
    unit: "pcs",
    minStock: 5,
    price: 0
  });

  useEffect(() => {
    setMounted(true);
    setItems(inventoryStorage.getAll());
  }, []);

  const refreshData = () => {
    setItems(inventoryStorage.getAll());
  };

  const handleTransaction = (type: 'usage' | 'restock') => {
    if (!selectedItem || transactionAmount <= 0) return;

    const newQuantity = type === 'restock'
      ? selectedItem.quantity + transactionAmount
      : selectedItem.quantity - transactionAmount;

    if (newQuantity < 0) {
      alert("Cannot use more than available stock!");
      return;
    }

    // 1. Update Inventory
    inventoryStorage.update(selectedItem.id, { quantity: newQuantity });

    // 2. Log History
    historyStorage.add({
      itemId: selectedItem.id,
      itemName: selectedItem.name,
      amount: transactionAmount,
      type: type,
      note: type === 'usage' ? 'Manual Usage Log' : 'Manual Restock'
    });

    refreshData();
    setIsUseDialogOpen(false);
    setIsRestockDialogOpen(false);
    setTransactionAmount(1);
    setSelectedItem(null);
  };

  const openTransactionDialog = (item: InventoryItem, type: 'usage' | 'restock') => {
    setSelectedItem(item);
    setTransactionAmount(1);
    if (type === 'usage') setIsUseDialogOpen(true);
    else setIsRestockDialogOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({ name: "", category: "Other", quantity: 0, unit: "pcs", minStock: 5, price: 0 });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.name) return;

    if (editingItem) {
      const updated = inventoryStorage.update(editingItem.id, formData);
      setItems(updated);
    } else {
      const newItem: InventoryItem = {
        id: crypto.randomUUID(),
        name: formData.name,
        category: formData.category as Category,
        quantity: Number(formData.quantity),
        unit: formData.unit || "pcs",
        minStock: Number(formData.minStock),
        price: Number(formData.price),
        lastUpdated: new Date().toISOString()
      };
      const updated = inventoryStorage.add(newItem);
      setItems(updated);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this item?")) {
      const updated = inventoryStorage.delete(id);
      setItems(updated);
    }
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockCount = items.filter(i => i.quantity <= i.minStock).length;

  if (!mounted) return <div className="flex items-center justify-center h-screen"><div className="text-muted-foreground">Loading...</div></div>;

  return (
    <div className="flex flex-col gap-8 p-8 md:p-12 max-w-[1600px] mx-auto w-full min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight text-foreground">
            Inventory
          </h1>
          <p className="text-muted-foreground text-lg">Manage your stock levels and pricing</p>
        </div>

        <div className="flex items-center gap-3">
          {lowStockCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary/10 border border-primary/30">
              <AlertTriangle className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">{lowStockCount} low stock</span>
            </div>
          )}
          <Button onClick={handleOpenAdd} size="lg" className="shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all bg-primary hover:bg-primary/90 group">
            <Plus className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          className="w-full h-12 rounded-lg border border-border bg-card px-12 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
          placeholder="Search by name or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Modern Table */}
      <div className="rounded-lg border border-border overflow-hidden bg-card/50 backdrop-blur-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="h-14 px-6 text-left align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs">Item</th>
              <th className="h-14 px-6 text-left align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs">Category</th>
              <th className="h-14 px-6 text-left align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs">Stock</th>
              <th className="h-14 px-6 text-right align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs">Price</th>
              <th className="h-14 px-6 text-center align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs">Status</th>
              <th className="h-14 px-6 text-right align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => {
                const isLowStock = item.quantity <= item.minStock;
                const stockPercentage = Math.min((item.quantity / (item.minStock * 3)) * 100, 100);

                return (
                  <tr
                    key={item.id}
                    className={cn(
                      "border-b border-border transition-all hover:bg-muted/50",
                      isLowStock && "bg-primary/[0.05]"
                    )}
                  >
                    <td className="px-6 py-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "h-10 w-10 rounded-lg flex items-center justify-center text-xs font-bold",
                          isLowStock ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                        )}>
                          {item.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{item.name}</div>
                          <div className="text-xs text-muted-foreground">{item.unit}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <span className="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium bg-muted text-muted-foreground border border-border">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <div className="w-full max-w-[160px] space-y-2">
                        <div className="flex items-baseline gap-2">
                          <span className={cn(
                            "text-2xl font-bold font-heading",
                            isLowStock ? "text-primary" : "text-foreground"
                          )}>
                            {item.quantity}
                          </span>
                          <span className="text-xs text-muted-foreground">/ {item.minStock} min</span>
                        </div>
                        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full transition-all duration-500",
                              isLowStock ? "bg-primary" : "bg-foreground/30"
                            )}
                            style={{ width: `${stockPercentage}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-middle text-right">
                      <div className="text-xl font-bold font-heading text-foreground">
                        ₦{item.price.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-middle text-center">
                      {isLowStock ? (
                        <span className="inline-flex items-center text-primary text-xs font-medium bg-primary/10 px-3 py-1.5 rounded-full border border-primary/30">
                          <AlertTriangle className="mr-1.5 h-3 w-3" /> Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-green-600 dark:text-green-400 text-xs font-medium bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/30">
                          <Check className="mr-1.5 h-3 w-3" /> In Stock
                        </span>
                      )}
                      <div className="mt-4 flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border-destructive/50 hover:bg-destructive/10 hover:text-destructive dark:text-red-400"
                          onClick={() => openTransactionDialog(item, 'usage')}
                        >
                          <MinusCircle className="mr-2 h-4 w-4" />
                          Use
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border-primary/50 hover:bg-primary/10 hover:text-primary"
                          onClick={() => openTransactionDialog(item, 'restock')}
                        >
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Add
                        </Button>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          {item.quantity} {item.unit}
                        </span>
                        <span>
                          Min: {item.minStock}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-middle text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted"
                          onClick={() => handleOpenEdit(item)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/10"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="h-32 text-center text-muted-foreground">
                  No items found matching "{searchTerm}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Edit Item" : "Add New Item"}
        description={editingItem ? "Update stock details" : "Add a new product to inventory"}
      >
        <div className="grid gap-5 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-sm font-medium text-muted-foreground">Name</label>
            <input
              className="col-span-3 h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Olive Oil"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-sm font-medium text-muted-foreground">Category</label>
            <select
              className="col-span-3 h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
            >
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-sm font-medium text-muted-foreground">Quantity</label>
            <div className="col-span-3 flex gap-2">
              <input
                type="number"
                className="h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
              />
              <input
                className="w-24 h-10 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="Unit"
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-sm font-medium text-muted-foreground">Min Stock</label>
            <input
              type="number"
              className="col-span-3 h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={formData.minStock}
              onChange={(e) => setFormData({ ...formData, minStock: Number(e.target.value) })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-sm font-medium text-muted-foreground">Price (₦)</label>
            <input
              type="number"
              className="col-span-3 h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={() => setIsModalOpen(false)} className="border-border hover:bg-muted">Cancel</Button>
          <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90 text-primary-foreground">Save Changes</Button>
        </div>
      </Dialog>
      {/* Usage Dialog */}
      <Dialog
        isOpen={isUseDialogOpen}
        onClose={() => setIsUseDialogOpen(false)}
        title="Log Stock Usage"
        description={`How much ${selectedItem?.name || 'item'} was used?`}
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-center gap-6 py-4">
            <Button variant="outline" size="icon" className="h-12 w-12 rounded-full" onClick={() => setTransactionAmount(Math.max(1, transactionAmount - 1))}>
              <MinusCircle className="h-6 w-6" />
            </Button>
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold font-heading">{transactionAmount}</span>
              <span className="text-sm text-muted-foreground">{selectedItem?.unit}</span>
            </div>
            <Button variant="outline" size="icon" className="h-12 w-12 rounded-full" onClick={() => setTransactionAmount(transactionAmount + 1)}>
              <PlusCircle className="h-6 w-6" />
            </Button>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsUseDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => handleTransaction('usage')}>Confirm Usage</Button>
          </div>
        </div>
      </Dialog>

      {/* Restock Dialog */}
      <Dialog
        isOpen={isRestockDialogOpen}
        onClose={() => setIsRestockDialogOpen(false)}
        title="Restock Item"
        description={`How much ${selectedItem?.name || 'item'} are you adding?`}
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-center gap-6 py-4">
            <Button variant="outline" size="icon" className="h-12 w-12 rounded-full" onClick={() => setTransactionAmount(Math.max(1, transactionAmount - 1))}>
              <MinusCircle className="h-6 w-6" />
            </Button>
            <input
              type="number"
              value={transactionAmount}
              onChange={(e) => setTransactionAmount(Number(e.target.value))}
              className="w-24 h-12 text-center text-2xl font-bold bg-transparent border-b-2 border-primary/50 focus:outline-none focus:border-primary text-foreground"
            />
            <Button variant="outline" size="icon" className="h-12 w-12 rounded-full" onClick={() => setTransactionAmount(transactionAmount + 1)}>
              <PlusCircle className="h-6 w-6" />
            </Button>
          </div>
          <div className="text-center text-sm text-muted-foreground -mt-4 mb-2">{selectedItem?.unit}</div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsRestockDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => handleTransaction('restock')}>Confirm Restock</Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
