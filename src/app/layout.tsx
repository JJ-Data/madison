import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Madison Inventory",
  description: "Restaurant Inventory Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen bg-background text-foreground">
          {/* Sidebar - Hidden on mobile for now (will add sheet later if needed, but 'md:flex' handles desktop) */}
          <Sidebar />

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto bg-background">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
