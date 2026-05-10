'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';

const NAV = [
  { href: '/admin/dashboard', label: 'Dashboard',       Icon: DashboardIcon },
  { href: '/admin/exams',     label: 'All Exams',       Icon: DescriptionIcon },
  { href: '/admin/exams/new', label: 'Upload Exam',     Icon: CloudUploadIcon },
  { href: '/admin/users',     label: 'User Management', Icon: PeopleIcon },
  { href: '/admin/settings',  label: 'Settings',        Icon: SettingsIcon },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const email = session?.user?.email;

  return (
    <aside
      className="w-64 shrink-0 flex flex-col"
      style={{ backgroundColor: 'var(--sidebar)', color: 'var(--sidebar-foreground)' }}
    >
      {/* Brand */}
      <div className="px-6 py-7" style={{ borderBottom: '1px solid oklch(0.3 0.02 260 / 0.4)' }}>
        <p className="text-xs uppercase tracking-[0.18em] opacity-60">Admin</p>
        <h1 className="text-xl font-bold mt-1">Question Bank</h1>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {NAV.map(({ href, label, Icon }) => {
          // Exact match only — prevents /admin/exams matching /admin/exams/new
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="admin-nav-link flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors"
              style={active
                ? { backgroundColor: 'var(--sidebar-accent)', color: 'var(--sidebar-accent-foreground)', fontWeight: 500 }
                : { color: 'oklch(0.97 0.003 247 / 0.75)' }
              }
            >
              <Icon style={{ fontSize: '1.125rem' }} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 text-xs opacity-50" style={{ borderTop: '1px solid oklch(0.3 0.02 260 / 0.4)' }}>
        {email && <p className="truncate mb-1">{email}</p>}
        <p>IELTS Platform · v1.0</p>
      </div>
    </aside>
  );
}
