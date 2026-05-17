import Link from "next/link";

import { getIncomingEcosystemNotifications } from "@/lib/ecosystem";

type EcosystemNotificationPanelProps = {
  appKey: string;
  title?: string;
  emptyText?: string;
};

const priorityStyles: Record<string, string> = {
  LOW: "bg-slate-100 text-slate-700",
  NORMAL: "bg-blue-100 text-blue-800",
  HIGH: "bg-amber-100 text-amber-800",
  URGENT: "bg-red-100 text-red-800",
};

export async function EcosystemNotificationPanel({
  appKey,
  title = "Nouveautes de l'ecosysteme",
  emptyText = "Aucun evenement entrant pour le moment.",
}: EcosystemNotificationPanelProps) {
  const notifications = await getIncomingEcosystemNotifications(appKey, 5);

  return (
    <section className="rounded-lg border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            KV Portfolio
          </p>
          <h2 className="mt-2 text-xl font-semibold">{title}</h2>
        </div>
        <span className="rounded-full border bg-background px-2.5 py-1 text-xs font-semibold text-muted-foreground">
          {notifications.length} new
        </span>
      </div>

      <div className="mt-5 grid gap-3">
        {notifications.length === 0 ? (
          <p className="rounded-md border bg-background p-4 text-sm text-muted-foreground">{emptyText}</p>
        ) : (
          notifications.map((notification) => (
            <article key={notification.id} className="rounded-md border bg-background p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-medium">{notification.title}</h3>
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${priorityStyles[notification.priority] ?? priorityStyles.NORMAL}`}>
                  {notification.priority}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{notification.message}</p>
              {notification.actionUrl ? (
                <Link
                  href={notification.actionUrl}
                  className="mt-3 inline-flex text-sm font-semibold text-primary underline-offset-4 hover:underline"
                >
                  {notification.actionLabel ?? "Continuer"}
                </Link>
              ) : null}
            </article>
          ))
        )}
      </div>
    </section>
  );
}

