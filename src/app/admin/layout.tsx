import AdminSidebar from '@/components/features/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 min-w-0 relative bg-app-canvas overflow-auto">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              'radial-gradient(900px 500px at 8% -10%, oklch(0.93 0.05 60 / 0.55), transparent 60%),' +
              'radial-gradient(700px 500px at 100% 0%, oklch(0.9 0.06 200 / 0.45), transparent 55%),' +
              'radial-gradient(800px 600px at 60% 110%, oklch(0.92 0.05 320 / 0.4), transparent 60%)',
          }}
        />
        <div className="relative max-w-6xl mx-auto px-10 py-10">{children}</div>
      </main>
    </div>
  );
}
