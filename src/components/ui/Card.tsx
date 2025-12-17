import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const cardVariants = cva(
  "flex flex-col gap-6 border transition-all duration-[var(--int-transition-fast)]",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground rounded-xl",
        // INT Figma Design System variants
        int: "bg-[var(--int-bg-card)] text-[var(--int-gray-900)] rounded-[var(--int-radius-lg)] border-[var(--int-gray-200)]",
        intElevated: "bg-[var(--int-bg-elevated)] text-[var(--int-gray-900)] rounded-[var(--int-radius-lg)] border-[var(--int-gray-200)] shadow-[var(--int-shadow-sm)]",
        intInteractive: "bg-[var(--int-bg-card)] text-[var(--int-gray-900)] rounded-[var(--int-radius-lg)] border-[var(--int-gray-200)] hover:border-[var(--int-gray-300)] hover:shadow-[var(--int-shadow-md)] cursor-pointer",
        intSelected: "bg-[var(--int-bg-card)] text-[var(--int-gray-900)] rounded-[var(--int-radius-lg)] border-2 border-[var(--int-primary)] shadow-[var(--int-shadow-lg)]",
        intPlatform: "bg-[var(--int-bg-card)] text-[var(--int-gray-900)] rounded-[var(--int-radius-lg)] border-[var(--int-gray-200)] hover:border-[var(--int-gray-300)] hover:shadow-[var(--int-shadow-md)] hover:scale-[1.02] cursor-pointer",
      },
      padding: {
        default: "",
        int: "p-4 md:p-6",
        none: "p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
    },
  }
);

function Card({
  className,
  variant,
  padding,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof cardVariants>) {
  return (
    <div
      data-slot="card"
      className={cn(cardVariants({ variant, padding, className }))}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <h4
      data-slot="card-title"
      className={cn("leading-none", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className,
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6 [&:last-child]:pb-6", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 pb-6 [.border-t]:pt-6", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  cardVariants,
};
