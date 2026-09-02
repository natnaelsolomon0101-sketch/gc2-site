import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * GC2 button. Squared, hairline, no shadows — institutional register.
 * Replaces four hand-copied class strings across Nav, Newsletter, 404 and menu.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-[14px] tracking-wide transition-colors disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        outline: "border border-ink text-ink hover:bg-ink hover:text-white",
        solid: "bg-ink text-white hover:bg-accent",
        accent: "bg-accent text-white hover:opacity-90",
        ghost: "text-ink-70 hover:text-ink",
        onNight: "border border-night-fg/30 text-night-fg hover:bg-night-fg hover:text-night",
      },
      size: {
        sm: "h-10 px-5",
        md: "h-12 px-7",
        lg: "h-14 px-9 text-[15px]",
      },
    },
    defaultVariants: { variant: "outline", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };
