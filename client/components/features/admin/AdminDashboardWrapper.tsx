'use client';

import dynamic from 'next/dynamic';
import type { DashboardData } from './AdminDashboardClient';

const AdminDashboardClient = dynamic(
  () => import('./AdminDashboardClient'),
  {
    ssr: false,
    loading: () => (
      <div className="text-sm py-20 text-center" style={{ color: 'var(--muted-foreground)' }}>
        Loading dashboard…
      </div>
    ),
  }
);

export default function AdminDashboardWrapper({ data }: { data: DashboardData }) {
  return <AdminDashboardClient data={data} />;
}
