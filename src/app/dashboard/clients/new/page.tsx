import Link from "next/link";
import { createClient } from "@/app/actions/clients";
import { getT } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function NewClientPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const [t, sp] = await Promise.all([getT(), searchParams]);
  const c = t.clients;

  return (
    <div className="px-6 py-10">
      <div className="mx-auto max-w-xl">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{c.label}</p>
          <h1 className="mt-3 text-2xl font-semibold">{c.formTitle}</h1>
        </div>

        {sp.error && (
          <div className="mb-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Formulaire invalide. Verifiez les champs.
          </div>
        )}

        <form action={createClient} className="space-y-5">
          <div className="grid gap-1.5">
            <Label htmlFor="name">{c.fieldName}</Label>
            <Input id="name" name="name" required />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="email">{c.fieldEmail}</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="companyName">{c.fieldCompany}</Label>
            <Input id="companyName" name="companyName" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="phone">{c.fieldPhone}</Label>
            <Input id="phone" name="phone" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="address">{c.fieldAddress}</Label>
            <Input id="address" name="address" />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <Button type="submit">{c.submit}</Button>
            <Button asChild variant="ghost">
              <Link href="/dashboard/clients">{c.cancel}</Link>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
