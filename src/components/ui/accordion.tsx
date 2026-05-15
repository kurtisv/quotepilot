import * as React from "react";

import { cn } from "@/lib/utils";

export function Accordion({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("divide-y border", className)} {...props} />;
}

export function AccordionItem({ className, ...props }: React.DetailsHTMLAttributes<HTMLDetailsElement>) {
  return <details className={cn("group", className)} {...props} />;
}

export function AccordionTrigger({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return <summary className={cn("cursor-pointer px-4 py-3 text-sm font-medium", className)} {...props} />;
}

export function AccordionContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-4 pb-4 text-sm text-muted-foreground", className)} {...props} />;
}
