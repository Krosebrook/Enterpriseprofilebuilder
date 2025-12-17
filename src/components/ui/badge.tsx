import * as React from "react";
import { Slot } from "@radix-ui/react-slot@1.1.2";
import { cva, type VariantProps } from "class-variance-authority@0.7.1";

import { cn } from "./utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90 rounded-md",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90 rounded-md",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 rounded-md",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground rounded-md",
        // INT Figma Design System variants
        intPrimary:
          "bg-[var(--int-primary)] text-white border-transparent rounded-[var(--int-radius-sm)]",
        intSuccess:
          "bg-[var(--int-success-light)] text-[var(--int-success-dark)] border-transparent rounded-[var(--int-radius-sm)]",
        intWarning:
          "bg-[var(--int-warning-light)] text-[var(--int-warning-dark)] border-transparent rounded-[var(--int-radius-sm)]",
        intError:
          "bg-[var(--int-error-light)] text-[var(--int-error-dark)] border-transparent rounded-[var(--int-radius-sm)]",
        intNeutral:
          "bg-[var(--int-gray-100)] text-[var(--int-gray-700)] border-transparent rounded-[var(--int-radius-sm)]",
        intInfo:
          "bg-[var(--int-info-light)] text-[var(--int-info-dark)] border-transparent rounded-[var(--int-radius-sm)]",
        // Pill style variants
        intPrimaryPill:
          "bg-[var(--int-primary)] text-white border-transparent rounded-[var(--int-radius-full)]",
        intSuccessPill:
          "bg-[var(--int-success-light)] text-[var(--int-success-dark)] border-transparent rounded-[var(--int-radius-full)]",
        intWarningPill:
          "bg-[var(--int-warning-light)] text-[var(--int-warning-dark)] border-transparent rounded-[var(--int-radius-full)]",
        intErrorPill:
          "bg-[var(--int-error-light)] text-[var(--int-error-dark)] border-transparent rounded-[var(--int-radius-full)]",
        intNeutralPill:
          "bg-[var(--int-gray-100)] text-[var(--int-gray-700)] border-transparent rounded-[var(--int-radius-full)]",
      },
      size: {
        default: "h-5 px-2 py-0.5 text-xs",
        sm: "h-4 px-1.5 py-0 text-[11px]",
        lg: "h-6 px-2.5 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Badge({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
