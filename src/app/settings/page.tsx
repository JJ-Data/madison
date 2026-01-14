export default function SettingsPage() {
    return (
        <div className="flex flex-col gap-6 p-6 md:p-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage your application preferences.</p>
            </div>

            <div className="rounded-lg border bg-card p-6">
                <h2 className="text-lg font-semibold mb-4">Appearance</h2>
                <div className="flex items-center justify-between">
                    <span>Theme</span>
                    <span className="text-sm text-muted-foreground">Madison Dark (Default)</span>
                </div>
            </div>

            <div className="rounded-lg border bg-card p-6">
                <h2 className="text-lg font-semibold mb-4">Data Management</h2>
                <div className="space-y-4">
                    <button className="text-sm text-destructive hover:underline">Reset Inventory Data</button>
                    <p className="text-xs text-muted-foreground">This will clear all local storage data.</p>
                </div>
            </div>
        </div>
    );
}
