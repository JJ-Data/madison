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
        return newItems;
    },

    update: (id: string, updates: Partial<InventoryItem>) => {
        const items = inventoryStorage.getAll();
        const newItems = items.map((item) => (item.id === id ? { ...item, ...updates, lastUpdated: new Date().toISOString() } : item));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
        return newItems;
    },

    delete: (id: string) => {
        const items = inventoryStorage.getAll();
        const newItems = items.filter((item) => item.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
        return newItems;
    },
};
