import Link from "next/link";

import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/#features", label: "Fonctionnalites" },
  { href: "/case-study", label: "Etude de cas" },
];

export function Navbar() {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-base font-semibold">
          QuotePilot
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-muted-foreground hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>
        <Button asChild size="sm">
          <Link href="/login">Dashboard</Link>
        </Button>
      </div>
    </header>
  );
}
