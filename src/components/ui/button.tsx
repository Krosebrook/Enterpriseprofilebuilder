import * as React from "react";
import { Slot } from "@radix-ui/react-slot@1.1.2";
import { cva, type VariantProps } from "class-variance-authority@0.7.1";

import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--int-radius-md)] text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        // INT Figma Design System variants
        intPrimary:
          "bg-[var(--int-primary)] text-white hover:bg-[var(--int-primary-hover)] active:bg-[var(--int-primary-active)] disabled:bg-[var(--int-primary-disabled)] shadow-[var(--int-shadow-sm)] hover:shadow-[var(--int-shadow-md)]",
        intSecondary:
          "border-2 border-[var(--int-primary)] text-[var(--int-primary)] bg-transparent hover:bg-[var(--int-primary-light)] active:bg-[var(--int-primary-light)]",
        intTertiary:
          "text-[var(--int-info)] hover:text-[var(--int-info-dark)] hover:bg-[var(--int-info-light)] bg-transparent",
        intSuccess:
          "bg-[var(--int-success)] text-white hover:bg-[var(--int-success-dark)]",
        intWarning:
          "bg-[var(--int-warning)] text-white hover:bg-[var(--int-warning-dark)]",
        intError:
          "bg-[var(--int-error)] text-white hover:bg-[var(--int-error-dark)]",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-[var(--int-radius-md)] gap-1.5 px-3 text-xs has-[>svg]:px-2.5",
        lg: "h-12 rounded-[var(--int-radius-md)] px-5 text-base has-[>svg]:px-4",
        icon: "size-9 rounded-[var(--int-radius-md)]",
        // INT Figma sizes
        intSm: "h-8 px-3 py-2 text-xs",
        intMd: "h-10 px-4 py-2.5 text-sm",
        intLg: "h-12 px-5 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
