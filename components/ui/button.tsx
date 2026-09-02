import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/** Slash controls: every button, input and tag is a 9999px pill. */
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[12px] font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // The white fill is a scarce resource — one per viewport.
        primary: "bg-ink text-white hover:bg-ink-3",
        ghost:   "border border-line bg-white text-ink hover:border-muted-2",
        tag:     "bg-surface text-ink hover:bg-line",
      },
      size: { sm: "px-[10px] py-[6px] text-[12px]", md: "px-5 py-[10px] text-[14px]" },
    },
    defaultVariants: { variant: "ghost", size: "md" },
  }
);

const Button = React.forwardRef<HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
);
Button.displayName = "Button";
export { Button, buttonVariants };
