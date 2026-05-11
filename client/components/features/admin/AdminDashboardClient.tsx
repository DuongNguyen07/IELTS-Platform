'use client';

import Link from 'next/link';
import {
  ResponsiveContainer, LineChart, Line,
  AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell,
  BarChart, Bar,
} from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import StarIcon from '@mui/icons-material/Star';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface DashboardData {
  totalExams: number;
  totalUsers: number;
  totalSubmissions: number;
  avgBand: number | null;
  examsBySkill: { name: string; value: number; color: string }[];
  recentExams: { title: string; skill: string; status: 'Published' | 'Draft' }[];
  bandDistribution: { band: string; count: number }[];
  submissionsTrend: { week: string; Reading: number; Listening: number; Writing: number; Speaking: number }[];
  sparkExams: number[];
  sparkUsers: number[];
  sparkSubmissions: number[];
  sparkBand: number[];
}

// ── Chart palette ─────────────────────────────────────────────────────────────

const SKILL_COLORS = {
  Reading:   'oklch(0.62 0.18 255)',
  Listening: 'oklch(0.7 0.16 165)',
  Writing:   'oklch(0.72 0.17 60)',
  Speaking:  'oklch(0.65 0.2 25)',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const toSparkData = (arr: number[]) => arr.map((v) => ({ v }));

function fmt(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`bg-white rounded-[0.625rem] border ${className}`}
      style={{ borderColor: 'var(--border)' }}
    >
      {children}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
      status === 'Published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
    }`}>
      {status}
    </span>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function AdminDashboardClient({ data }: { data: DashboardData }) {
  const {
    totalExams, totalUsers, totalSubmissions, avgBand,
    examsBySkill, recentExams, bandDistribution, submissionsTrend,
    sparkExams, sparkUsers, sparkSubmissions, sparkBand,
  } = data;

  const STATS = [
    { label: 'Total Exams',    value: fmt(totalExams),      delta: `${totalExams} in the bank`,            icon: AssignmentIcon, color: SKILL_COLORS.Reading,   spark: sparkExams },
    { label: 'Active Users',   value: fmt(totalUsers),      delta: `${totalUsers} registered students`,    icon: PeopleIcon,     color: SKILL_COLORS.Listening, spark: sparkUsers },
    { label: 'Submissions',    value: fmt(totalSubmissions), delta: `${totalSubmissions} completed tests`,  icon: TrendingUpIcon, color: SKILL_COLORS.Writing,   spark: sparkSubmissions },
    { label: 'Avg Band Score', value: avgBand ? avgBand.toFixed(1) : '—', delta: 'across all submissions', icon: StarIcon,       color: SKILL_COLORS.Speaking,  spark: sparkBand },
  ];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Dashboard</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
            Overview of your IELTS question bank.
          </p>
        </div>
        <Link
          href="/admin/exams/new"
          className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors"
        >
          + New Exam
        </Link>
      </div>

      {/* Row A — 4 stat cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {STATS.map(({ label, value, delta, icon: Icon, color, spark }) => (
          <Card key={label} className="p-5 flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{label}</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
                <p className="text-xs text-emerald-600 mt-0.5">{delta}</p>
              </div>
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: color.replace(')', ' / 0.12)') }}
              >
                <Icon style={{ fontSize: '1.1rem', color }} />
              </div>
            </div>
            <div className="h-12">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={toSparkData(spark)}>
                  <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        ))}
      </div>

      {/* Row B */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Submissions Trend */}
        <Card className="lg:col-span-2 p-6">
          <p className="font-semibold text-gray-900 mb-4">Submissions Trend</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={submissionsTrend}>
                <defs>
                  <linearGradient id="gReading" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={SKILL_COLORS.Reading}   stopOpacity={0.3} />
                    <stop offset="95%" stopColor={SKILL_COLORS.Reading}   stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gListening" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={SKILL_COLORS.Listening} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={SKILL_COLORS.Listening} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.929 0.013 255.508)" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="Reading"   stroke={SKILL_COLORS.Reading}   fill="url(#gReading)"   strokeWidth={2} />
                <Area type="monotone" dataKey="Listening" stroke={SKILL_COLORS.Listening} fill="url(#gListening)" strokeWidth={2} />
                <Line type="monotone" dataKey="Writing"   stroke={SKILL_COLORS.Writing}   strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Speaking"  stroke={SKILL_COLORS.Speaking}  strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Exams by Skill donut */}
        <Card className="p-6">
          <p className="font-semibold text-gray-900 mb-4">Exams by Skill</p>
          {examsBySkill.length === 0 ? (
            <p className="text-sm text-center py-16" style={{ color: 'var(--muted-foreground)' }}>No exams yet.</p>
          ) : (
            <>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={examsBySkill} cx="50%" cy="50%" innerRadius={48} outerRadius={78} paddingAngle={2} dataKey="value">
                      {examsBySkill.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3">
                {examsBySkill.map((d) => (
                  <div key={d.name} className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                    <span>{d.name}</span>
                    <span className="ml-auto font-semibold text-gray-900">{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>
      </div>

      {/* Row C */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Band Score Distribution */}
        <Card className="lg:col-span-2 p-6">
          <p className="font-semibold text-gray-900 mb-4">Band Score Distribution</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bandDistribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.929 0.013 255.508)" />
                <XAxis dataKey="band" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill={SKILL_COLORS.Reading} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Recent Exams */}
        <Card className="p-6 flex flex-col">
          <p className="font-semibold text-gray-900 mb-4">Recent Exams</p>
          {recentExams.length === 0 ? (
            <p className="text-sm py-8 text-center" style={{ color: 'var(--muted-foreground)' }}>No exams uploaded yet.</p>
          ) : (
            <div className="flex-1 divide-y" style={{ borderColor: 'var(--border)' }}>
              {recentExams.map((exam, i) => (
                <div key={i} className="flex items-center justify-between py-3 gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{exam.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{exam.skill}</p>
                  </div>
                  <StatusPill status={exam.status} />
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2 mt-4 pt-4" style={{ borderTop: `1px solid var(--border)` }}>
            <Link href="/admin/exams/new" className="flex-1 text-xs font-semibold text-center py-2 rounded-lg border hover:bg-gray-50 transition-colors" style={{ borderColor: 'var(--border)' }}>
              Upload exam JSON
            </Link>
            <Link href="/admin/users" className="flex-1 text-xs font-semibold text-center py-2 rounded-lg border hover:bg-gray-50 transition-colors" style={{ borderColor: 'var(--border)' }}>
              Manage users
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
