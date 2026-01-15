export type Category = "Spices" | "Vegetables" | "Meat" | "Wines" | "Dry Goods" | "Dairy" | "Other";

export interface InventoryItem {
    id: string;
    name: string;
    category: Category;
    quantity: number;
    unit: string;
    minStock: number; // Low stock threshold
    price: number;
    lastUpdated: string;
}

export const INITIAL_INVENTORY: InventoryItem[] = [
    { id: "1", name: "Thyme", category: "Spices", quantity: 50, unit: "jars", minStock: 10, price: 1200, lastUpdated: new Date().toISOString() },
    { id: "2", name: "Basmati Rice", category: "Dry Goods", quantity: 12, unit: "bags", minStock: 5, price: 45000, lastUpdated: new Date().toISOString() },
    { id: "3", name: "Red Wine (Merlot)", category: "Wines", quantity: 8, unit: "bottles", minStock: 12, price: 8500, lastUpdated: new Date().toISOString() },
    { id: "4", name: "Fresh Tomatoes", category: "Vegetables", quantity: 5, unit: "crates", minStock: 2, price: 15000, lastUpdated: new Date().toISOString() },
    { id: "5", name: "Chicken Breast", category: "Meat", quantity: 20, unit: "kg", minStock: 15, price: 3500, lastUpdated: new Date().toISOString() },
];

const STORAGE_KEY = "madison_inventory_v1";

// History Types
export type TransactionType = 'restock' | 'usage' | 'adjustment' | 'correction';

export interface InventoryTransaction {
    id: string;
    itemId: string;
    itemName: string;
    amount: number; // Positive for restock, Negative for usage (usually, but let's keep absolute and use type)
    type: TransactionType;
    date: string;
    note?: string;
}

const HISTORY_KEY = "madison_inventory_history_v1";

export const historyStorage = {
    getAll: (): InventoryTransaction[] => {
        if (typeof window === "undefined") return [];
        const stored = localStorage.getItem(HISTORY_KEY);
        if (!stored) return [];
        return JSON.parse(stored);
    },

    add: (transaction: Omit<InventoryTransaction, "id" | "date">) => {
        const history = historyStorage.getAll();
        const newTransaction: InventoryTransaction = {
            ...transaction,
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
        };
        const newHistory = [newTransaction, ...history];
        localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
        return newTransaction;
    },

    getByItem: (itemId: string) => {
        const history = historyStorage.getAll();
        return history.filter(h => h.itemId === itemId);
    },

    // Get usage stats for a specific date range
    getUsageStats: (days: number = 7) => {
        const history = historyStorage.getAll();
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);

        return history.filter(h =>
            h.type === 'usage' &&
            new Date(h.date) >= cutoff
        );
    }
};

export const inventoryStorage = {
    getAll: (): InventoryItem[] => {
        if (typeof window === "undefined") return INITIAL_INVENTORY;
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_INVENTORY));
            return INITIAL_INVENTORY;
        }
        return JSON.parse(stored);
    },

    add: (item: InventoryItem) => {
        const items = inventoryStorage.getAll();
        const newItems = [item, ...items];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));

        // Log Initial Stock
        historyStorage.add({
            itemId: item.id,
            itemName: item.name,
            amount: item.quantity,
            type: 'restock',
            note: 'Initial Stock'
        });

        return newItems;
    },

    update: (id: string, updates: Partial<InventoryItem>) => {
        const items = inventoryStorage.getAll();
        const oldItem = items.find(i => i.id === id);

        const newItems = items.map((item) => (item.id === id ? { ...item, ...updates, lastUpdated: new Date().toISOString() } : item));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));

        // Note: Generic updates don't automatically log history unless we know the context.
        // We will call historyStorage.add manually from the UI when "Using" or "Restocking".

        return newItems;
    },

    delete: (id: string) => {
        const items = inventoryStorage.getAll();
        const newItems = items.filter((item) => item.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
        return newItems;
    },
};
