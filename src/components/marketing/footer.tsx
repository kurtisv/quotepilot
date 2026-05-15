import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto grid max-w-6xl gap-6 px-6 py-10 text-sm text-muted-foreground sm:grid-cols-3">
        <div>
          <p className="font-medium text-foreground">QuotePilot</p>
          <p className="mt-2">Creez et envoyez des soumissions professionnelles en quelques minutes.</p>
        </div>
        <div className="grid gap-2">
          <Link href="/#features">Fonctionnalites</Link>
          <Link href="/case-study">Etude de cas</Link>
          <Link href="/login">Connexion</Link>
        </div>
        <div className="grid gap-2">
          <Link href="/privacy">Confidentialite</Link>
          <Link href="/terms">Conditions</Link>
        </div>
      </div>
    </footer>
  );
}
