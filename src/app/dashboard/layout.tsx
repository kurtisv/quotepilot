import Link from "next/link";
import { LayoutDashboard, Users, FileText, Settings } from "lucide-react";
import { getLang, getT } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/language-switcher";
import { requireDashboardAccess } from "@/lib/dashboard-auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireDashboardAccess();
  const [lang, t] = await Promise.all([getLang(), getT()]);
  const nav = t.nav;

  const links = [
    { href: "/dashboard", label: nav.home, icon: LayoutDashboard },
    { href: "/dashboard/clients", label: nav.clients, icon: Users },
    { href: "/dashboard/quotes", label: nav.quotes, icon: FileText },
    { href: "/dashboard/settings", label: nav.settings, icon: Settings },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {/* Demo bar */}
      <div className="border-b bg-black px-6 py-2 text-center text-xs text-white/70">
        {t.dashboard.demoBar}
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden w-56 shrink-0 border-r bg-background lg:block">
          <div className="flex h-14 items-center border-b px-5">
            <Link href="/" className="text-sm font-semibold">QuotePilot</Link>
          </div>
          <nav className="p-3 space-y-0.5">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="flex items-center gap-2.5 rounded px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <l.icon className="h-4 w-4" />
                {l.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <div className="flex flex-1 flex-col">
          {/* Top bar */}
          <header className="flex h-14 items-center justify-between border-b bg-background px-6">
            <Link href="/" className="text-sm font-semibold lg:hidden">QuotePilot</Link>
            <div className="flex items-center gap-4 ml-auto">
              <LanguageSwitcher current={lang} />
            </div>
          </header>
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </div>
  );
}
