import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default:      "border-transparent bg-primary text-primary-foreground",
        secondary:    "border-transparent bg-secondary text-secondary-foreground",
        destructive:  "border-transparent bg-destructive text-destructive-foreground",
        outline:      "text-foreground border-current",
        beginner:     "border-transparent bg-emerald-100 text-emerald-700",
        intermediate: "border-transparent bg-amber-100 text-amber-700",
        advanced:     "border-transparent bg-rose-100 text-rose-700",
        hybrid:       "border-transparent badge-hybrid",
        content:      "border-transparent badge-content",
        collaborative:"border-transparent badge-collaborative",
        popular:      "border-transparent badge-popular",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
