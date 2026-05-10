import SettingsTabs from '@/components/features/admin/SettingsTabs';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Settings</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
          Configure platform behaviour and defaults.
        </p>
      </div>

      <SettingsTabs />
    </div>
  );
}
