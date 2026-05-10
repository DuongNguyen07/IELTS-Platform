'use client';

import { useState } from 'react';
import Switch from '@mui/material/Switch';

type Tab = 'General' | 'Exam Defaults' | 'Scoring' | 'Notifications';
const TABS: Tab[] = ['General', 'Exam Defaults', 'Scoring', 'Notifications'];

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[0.625rem] border p-6" style={{ borderColor: 'var(--border)' }}>
      {children}
    </div>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid md:grid-cols-3 gap-4 items-start py-4 border-t first:border-t-0" style={{ borderColor: 'var(--border)' }}>
      <label className="text-sm font-medium text-gray-700 pt-2">{label}</label>
      <div className="md:col-span-2">{children}</div>
    </div>
  );
}

function ToggleRow({ label, desc, defaultChecked }: { label: string; desc: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-center justify-between py-3 border-t first:border-t-0" style={{ borderColor: 'var(--border)' }}>
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{desc}</p>
      </div>
      <Switch defaultChecked={defaultChecked} size="small" />
    </div>
  );
}

function TextInput({ defaultValue, placeholder }: { defaultValue?: string; placeholder?: string }) {
  return (
    <input
      defaultValue={defaultValue}
      placeholder={placeholder}
      className="w-full px-3 py-2 text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/20"
      style={{ borderColor: 'var(--border)' }}
    />
  );
}

function SelectInput({ options, defaultValue }: { options: string[]; defaultValue?: string }) {
  return (
    <select
      defaultValue={defaultValue}
      className="w-full px-3 py-2 text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/20"
      style={{ borderColor: 'var(--border)' }}
    >
      {options.map((o) => <option key={o}>{o}</option>)}
    </select>
  );
}

function SaveButton() {
  return (
    <div className="flex justify-end mt-6 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
      <button className="bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors">
        Save changes
      </button>
    </div>
  );
}

// ── Tab panels ────────────────────────────────────────────────────────────────

function GeneralPanel() {
  return (
    <Card>
      <h2 className="font-semibold text-gray-900 mb-2">General</h2>
      <FieldRow label="Platform Name">
        <TextInput defaultValue="IELTS Booster" />
      </FieldRow>
      <FieldRow label="Support Email">
        <TextInput defaultValue="support@ieltsbooster.com" placeholder="support@example.com" />
      </FieldRow>
      <FieldRow label="Default Language">
        <SelectInput options={['English', 'Vietnamese', 'Chinese', 'Japanese']} defaultValue="English" />
      </FieldRow>
      <FieldRow label="Timezone">
        <SelectInput options={['UTC+7 (Ho Chi Minh City)', 'UTC+0 (London)', 'UTC+8 (Singapore)', 'UTC-5 (New York)']} defaultValue="UTC+7 (Ho Chi Minh City)" />
      </FieldRow>
      <SaveButton />
    </Card>
  );
}

function ExamDefaultsPanel() {
  return (
    <Card>
      <h2 className="font-semibold text-gray-900 mb-2">Exam Defaults</h2>
      <FieldRow label="Reading Duration (min)">
        <TextInput defaultValue="60" />
      </FieldRow>
      <FieldRow label="Listening Duration (min)">
        <TextInput defaultValue="30" />
      </FieldRow>
      <FieldRow label="Total Questions">
        <TextInput defaultValue="40" />
      </FieldRow>
      <FieldRow label="Default Difficulty">
        <SelectInput options={['Easy', 'Intermediate', 'Advanced']} defaultValue="Intermediate" />
      </FieldRow>
      <div className="mt-4">
        <ToggleRow label="Auto-save drafts"           desc="Automatically save exam drafts every 5 minutes." />
        <ToggleRow label="Require slug uniqueness"    desc="Prevent duplicate slugs when uploading exams." defaultChecked />
      </div>
      <SaveButton />
    </Card>
  );
}

function ScoringPanel() {
  return (
    <Card>
      <h2 className="font-semibold text-gray-900 mb-2">Scoring</h2>
      <ToggleRow label="Show band score after submission" desc="Display the computed band score immediately after students submit." defaultChecked />
      <ToggleRow label="Allow review mode"               desc="Let students review their answers after submitting." defaultChecked />
      <ToggleRow label="Penalize unanswered questions"   desc="Subtract points for questions left blank." />
      <SaveButton />
    </Card>
  );
}

function NotificationsPanel() {
  return (
    <Card>
      <h2 className="font-semibold text-gray-900 mb-2">Notifications</h2>
      <ToggleRow label="New submission alerts" desc="Get notified when a student submits an exam." defaultChecked />
      <ToggleRow label="Weekly summary email"  desc="Receive a weekly digest of platform activity." defaultChecked />
      <ToggleRow label="New user signups"      desc="Get notified when a new student registers." />
      <SaveButton />
    </Card>
  );
}

const PANELS: Record<Tab, React.ReactNode> = {
  'General':       <GeneralPanel />,
  'Exam Defaults': <ExamDefaultsPanel />,
  'Scoring':       <ScoringPanel />,
  'Notifications': <NotificationsPanel />,
};

export default function SettingsTabs() {
  const [activeTab, setActiveTab] = useState<Tab>('General');

  return (
    <div className="grid md:grid-cols-12 gap-8">
      {/* Left nav */}
      <nav className="md:col-span-3 space-y-1">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
            style={activeTab === tab
              ? { backgroundColor: 'oklch(0.968 0.007 247.896)', color: 'oklch(0.129 0.042 264.695)' }
              : { color: 'var(--muted-foreground)' }
            }
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* Panel */}
      <div className="md:col-span-9">
        {PANELS[activeTab]}
      </div>
    </div>
  );
}
