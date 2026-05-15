import * as React from "react";

import { cn } from "@/lib/utils";

export function DropdownMenu({ className, ...props }: React.DetailsHTMLAttributes<HTMLDetailsElement>) {
  return <details className={cn("relative inline-block", className)} {...props} />;
}

export function DropdownMenuTrigger({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return <summary className={cn("list-none cursor-pointer", className)} {...props} />;
}

export function DropdownMenuContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("absolute right-0 z-50 mt-2 min-w-40 border bg-card p-1 shadow-lg", className)} {...props} />;
}

export function DropdownMenuItem({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("cursor-pointer px-3 py-2 text-sm hover:bg-muted", className)} {...props} />;
}
