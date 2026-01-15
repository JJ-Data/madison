"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Lock, Mail, Loader2 } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Mock login delay
        setTimeout(() => {
            router.push("/");
        }, 1500);
    };

    return (
        <div className="flex min-h-screen w-full bg-background text-foreground">
            {/* Left Side - Hero Image/Brand */}
            <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-zinc-900 p-12 text-white lg:flex">
                {/* Abstract Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-stone-900 to-black" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                <div className="relative z-10 flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full border border-white/20">
                        <Image src="/logo.png" alt="Madison Logo" fill className="object-cover" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">Madison</span>
                </div>

                <div className="relative z-10 space-y-4 max-w-lg">
                    <blockquote className="space-y-2">
                        <p className="text-lg font-medium leading-relaxed">
                            &ldquo;The secret ingredient is always love, but precise inventory management ensures we never run out of it.&rdquo;
                        </p>
                        <footer className="text-sm text-white/60 pt-2">— Madison Kitchen Team</footer>
                    </blockquote>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex flex-1 items-center justify-center p-8 lg:p-12 bg-card/10 backdrop-blur-3xl">
                <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[380px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-3xl font-heading font-bold tracking-tight">Welcome back</h1>
                        <p className="text-sm text-muted-foreground">
                            Enter your credentials to access the dashboard
                        </p>
                    </div>

                    <div className="grid gap-6">
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <input
                                        id="email"
                                        placeholder="admin@madison.com"
                                        type="email"
                                        autoCapitalize="none"
                                        autoComplete="email"
                                        autoCorrect="off"
                                        className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 pl-9 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
                                        Password
                                    </label>
                                    <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <input
                                        id="password"
                                        placeholder="••••••••"
                                        type="password"
                                        autoComplete="current-password"
                                        className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 pl-9 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        required
                                    />
                                </div>
                            </div>
                            <Button type="submit" disabled={loading} className="w-full h-11 shadow-lg shadow-primary/20">
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    "Sign In"
                                )}
                            </Button>
                        </form>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-border/50" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Button variant="outline" type="button" disabled={loading} className="h-10 hover:bg-card">
                                Google
                            </Button>
                            <Button variant="outline" type="button" disabled={loading} className="h-10 hover:bg-card">
                                Apple
                            </Button>
                        </div>
                    </div>

                    <p className="px-8 text-center text-sm text-muted-foreground">
                        By clicking continue, you agree to our{" "}
                        <a href="#" className="underline underline-offset-4 hover:text-primary">
                            Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="underline underline-offset-4 hover:text-primary">
                            Privacy Policy
                        </a>
                        .
                    </p>
                </div>
            </div>
        </div>
    );
}
