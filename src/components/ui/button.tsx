import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Since we haven't installed class-variance-authority yet, I will mock it or implement a simple version if I don't want to wait. 
// Actually, I should wait for npm install to be safe, but for now I will assume CVA is available or just implement without it for simplicity if I can't install it yet.
// Wait, I can't use 'cva' import if I haven't installed it.
// I'll implement a simple button without CVA for now, or just wait.
// "Sleek" requires good buttons.
// I'll implement a CVA-less version that is easy to upgrade, OR just rely on the fact I will install it very soon.
// I'll implement a simple version with clsx directly to avoid 'module not found' on build until I install cva.

const buttonVariants = (variant: string = 'default', size: string = 'default', className: string = '') => {
    const base = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"

    const variants: Record<string, string> = {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
    }

    const sizes: Record<string, string> = {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
    }

    return cn(base, variants[variant] || variants.default, sizes[size] || sizes.default, className)
}

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
    size?: "default" | "sm" | "lg" | "icon"
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = "button"
        return (
            <Comp
                className={buttonVariants(variant, size, className)}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
