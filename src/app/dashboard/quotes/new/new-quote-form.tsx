"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { createQuote } from "@/app/actions/quotes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Client = { id: string; name: string; companyName: string | null };

interface NewQuoteFormProps {
  clients: Client[];
  labels: {
    label: string; formTitle: string; fieldClient: string; fieldTitle: string;
    fieldDesc: string; fieldTaxRate: string; fieldValidUntil: string;
    itemsTitle: string; itemName: string; itemQty: string; itemPrice: string;
    itemTotal: string; addItem: string; removeItem: string; submit: string; cancel: string;
  };
}

export function NewQuoteForm({ clients, labels }: NewQuoteFormProps) {
  const [items, setItems] = useState([{ name: "", description: "", quantity: 1, unitPrice: "" }]);
  const formRef = useRef<HTMLFormElement>(null);

  const addItem = () =>
    setItems((prev) => [...prev, { name: "", description: "", quantity: 1, unitPrice: "" }]);

  const removeItem = (i: number) =>
    setItems((prev) => prev.filter((_, idx) => idx !== i));

  const subtotal = items.reduce((s, it) => s + (Number(it.unitPrice) || 0) * it.quantity, 0);
  const tax = subtotal * 0.14975;
  const total = subtotal + tax;

  return (
    <form ref={formRef} action={createQuote} className="space-y-6">
      <div className="grid gap-1.5">
        <Label htmlFor="clientId">{labels.fieldClient}</Label>
        <select
          id="clientId"
          name="clientId"
          required
          className="flex h-9 w-full border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="">—</option>
          {clients.map((cl) => (
            <option key={cl.id} value={cl.id}>
              {cl.name}{cl.companyName ? ` — ${cl.companyName}` : ""}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="title">{labels.fieldTitle}</Label>
        <Input id="title" name="title" required />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="description">{labels.fieldDesc}</Label>
        <Input id="description" name="description" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="taxRatePercent">{labels.fieldTaxRate}</Label>
          <Input id="taxRatePercent" name="taxRatePercent" type="number" step="0.001" defaultValue="14.975" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="validUntil">{labels.fieldValidUntil}</Label>
          <Input id="validUntil" name="validUntil" type="date" />
        </div>
      </div>

      {/* Line items */}
      <div>
        <h2 className="mb-3 text-sm font-semibold">{labels.itemsTitle}</h2>
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="grid gap-2 border bg-muted/20 p-4 sm:grid-cols-[1fr_60px_100px_auto]">
              <div className="grid gap-1">
                <input
                  name={`items[${i}][name]`}
                  placeholder={labels.itemName}
                  value={item.name}
                  onChange={(e) => setItems((p) => p.map((it, idx) => idx === i ? { ...it, name: e.target.value } : it))}
                  required
                  className="flex h-9 w-full border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                />
                <input
                  name={`items[${i}][description]`}
                  placeholder="Description (optionnel)"
                  value={item.description}
                  onChange={(e) => setItems((p) => p.map((it, idx) => idx === i ? { ...it, description: e.target.value } : it))}
                  className="flex h-8 w-full border bg-background px-3 text-xs text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
              <input
                name={`items[${i}][quantity]`}
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => setItems((p) => p.map((it, idx) => idx === i ? { ...it, quantity: Number(e.target.value) } : it))}
                placeholder={labels.itemQty}
                className="flex h-9 w-full border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <input
                name={`items[${i}][unitPrice]`}
                type="number"
                min="0"
                step="0.01"
                value={item.unitPrice}
                onChange={(e) => setItems((p) => p.map((it, idx) => idx === i ? { ...it, unitPrice: e.target.value } : it))}
                placeholder={labels.itemPrice}
                className="flex h-9 w-full border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(i)}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  {labels.removeItem}
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addItem}
          className="mt-3 text-sm text-muted-foreground hover:text-foreground"
        >
          {labels.addItem}
        </button>
      </div>

      {/* Live totals preview */}
      <div className="border bg-muted/20 p-4 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Sous-total</span><span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Taxes (14.975%)</span><span>${tax.toFixed(2)}</span>
        </div>
        <div className="mt-2 flex justify-between border-t pt-2 font-semibold">
          <span>Total</span><span>${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit">{labels.submit}</Button>
        <Button asChild variant="ghost">
          <Link href="/dashboard/quotes">{labels.cancel}</Link>
        </Button>
      </div>
    </form>
  );
}
