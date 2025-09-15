"use client"

function AdminCard({
  title,
  description,
  href,
}: {
  title: string
  description: string
  href: string
}) {
  return (
    <a
      href={href}
      className="block rounded-xl border border-border/40 bg-muted/40 p-5 transition hover:border-primary/50"
    >
      <h3 className="text-base font-medium">{title}</h3>
      <p className="mt-2 text-sm text-foreground/70">{description}</p>
      <span className="mt-4 inline-block text-xs text-primary">Open →</span>
    </a>
  )
}

export default function AdminOverviewPage() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <AdminCard
        title="Site Settings"
        href="/admin/site-settings"
        description="Edit hero headline, subtitle, and CTA."
      />
      <AdminCard title="Events" href="/admin/events" description="Create, update, or remove events." />
      <AdminCard title="Gallery" href="/admin/gallery" description="Manage photos for the gallery." />
      <AdminCard title="About Us" href="/admin/about" description="Update your about content." />
      <AdminCard title="Profile" href="/admin/profile" description="Manage your admin profile." />
    </div>
  )
}
