import { Footer } from "@/components/marketing/footer";
import { Navbar } from "@/components/marketing/navbar";

export function MarketingPageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
