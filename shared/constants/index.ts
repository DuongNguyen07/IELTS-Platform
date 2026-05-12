import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import BarChartIcon from '@mui/icons-material/BarChart';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import CreateIcon from '@mui/icons-material/Create';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import MicIcon from '@mui/icons-material/Mic';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import FlagIcon from '@mui/icons-material/Flag';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import XIcon from '@mui/icons-material/X';
import PublicIcon from '@mui/icons-material/Public';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LanguageIcon from '@mui/icons-material/Language';
import LightModeIcon from '@mui/icons-material/LightMode';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import InsightsIcon from '@mui/icons-material/Insights';
import SchoolIcon from '@mui/icons-material/School';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import type { SvgIconComponent } from '@mui/icons-material';

// ICON MAPPING
export const ICONS = {
  // Navigation
  dashboard: DashboardIcon,
  examLibrary: MenuBookIcon,
  performance: BarChartIcon,
  material: FolderOpenIcon,

  // User Actions
  notifications: NotificationsIcon,
  profile: PersonIcon,
  settings: SettingsIcon,
  logout: LogoutIcon,

  // UI Controls
  menu: MenuIcon,
  close: CloseIcon,
  expandMore: ExpandMoreIcon,

  // Module Types
  writing: CreateIcon,
  reading: MenuBookIcon,
  listening: HeadphonesIcon,
  speaking: MicIcon,

  // Actions
  play: PlayCircleIcon,
  assignment: AssignmentTurnedInIcon,
  library: LibraryBooksIcon,
  flag: FlagIcon,
  rocket: RocketLaunchIcon,
  check: CheckCircleIcon,
  checkOutline: CheckCircleOutline,

  // Exam Library
  school: SchoolIcon,
  schedule: AccessTimeIcon,
  search: SearchIcon,
  tune: TuneIcon,

  // Decorative
  autoAwesome: AutoAwesomeIcon,

  // Footer
  x: XIcon,
  public: PublicIcon,
  youtube: YouTubeIcon,
  language: LanguageIcon,
  lightMode: LightModeIcon,
};

// BRAND INFORMATION
export const BRAND = {
  name: 'IELTS Booster',
  tagline: 'Master the IELTS with Confidence',
  description: 'AI-powered IELTS practice platform',
  logo: '/images/logo-icon.png',
};

// COLORS
export const COLORS = {
  primary: '#2b6cee',
  navy: '#0d121b',
  tealAccent: '#14b8a6',
};

interface NavLink {
  href: string;
  label: string;
  Icon: SvgIconComponent;
  description: string;
}

// NAVIGATION LINKS (Authenticated Users)
export const AUTH_NAV_LINKS: NavLink[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    Icon: DashboardIcon,
    description: 'View your progress and statistics'
  },
  {
    href: '/exam-library',
    label: 'Exam Library',
    Icon: MenuBookIcon,
    description: 'Access practice tests and materials'
  },
  {
    href: '/performance',
    label: 'Performance',
    Icon: BarChartIcon,
    description: 'Track your scores and improvement'
  },
  {
    href: '/material',
    label: 'Material',
    Icon: FolderOpenIcon,
    description: 'Study materials and resources'
  },
];

// MODULE TYPES (For Lessons)
export const MODULE_TYPES = {
  writing: {
    key: 'writing',
    label: 'Writing',
    Icon: CreateIcon,
  },
  reading: {
    key: 'reading',
    label: 'Reading',
    Icon: MenuBookIcon,
  },
  listening: {
    key: 'listening',
    label: 'Listening',
    Icon: HeadphonesIcon,
  },
  speaking: {
    key: 'speaking',
    label: 'Speaking',
    Icon: MicIcon,
  },
};

interface QuickAction {
  Icon: SvgIconComponent;
  title: string;
  description: string;
  link: string;
  linkText: string;
  bgColor: string;
  iconColor: string;
  linkColor: string;
}

// QUICK ACTIONS (Dashboard Cards)
export const QUICK_ACTIONS: QuickAction[] = [
  {
    Icon: AssignmentTurnedInIcon,
    title: 'Take a Diagnostic Test',
    description: 'Identify your strengths and weaknesses across all four sections.',
    link: '/diagnostic-test',
    linkText: 'Start Test',
    bgColor: '#dbeafe',
    iconColor: '#2563eb',
    linkColor: '#2563eb',
  },
  {
    Icon: LibraryBooksIcon,
    title: 'Browse Study Materials',
    description: 'Access curated PDFs, video lessons, and vocabulary cheat sheets.',
    link: '/materials',
    linkText: 'View Library',
    bgColor: '#ccfbf1',
    iconColor: '#14b8a6',
    linkColor: '#14b8a6',
  },
  {
    Icon: FlagIcon,
    title: 'Set a Study Goal',
    description: 'Define your target band score and get a personalized timeline.',
    link: '/goals',
    linkText: 'Create Goal',
    bgColor: '#f3e8ff',
    iconColor: '#9333ea',
    linkColor: '#9333ea',
  },
];

interface Feature {
  Icon: SvgIconComponent;
  title: string;
  description: string;
  color: string;
}

// FEATURES (Landing Page)
export const FEATURES: Feature[] = [
  {
    Icon: AssignmentTurnedInIcon,
    title: 'Simulated Exams',
    description: 'Realistic practice tests that mimic the actual IELTS environment.',
    color: 'blue',
  },
  {
    Icon: AutoGraphIcon,
    title: 'AI-Powered Scoring',
    description: 'Get instant feedback on your writing and speaking with advanced AI analysis.',
    color: 'purple',
  },
  {
    Icon: InsightsIcon,
    title: 'Performance Analytics',
    description: 'Track your progress with detailed insights and identify areas for improvement.',
    color: 'green',
  },
  {
    Icon: SchoolIcon,
    title: 'Expert Resources',
    description: 'Access curated study materials, tips, and strategies from IELTS experts.',
    color: 'orange',
  },
];

interface FooterLink {
  label: string;
  href: string;
}

// FOOTER LINKS
export const FOOTER_LINKS: { platform: FooterLink[]; legal: FooterLink[] } = {
  platform: [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Exam Library', href: '/exam-library' },
    { label: 'Performance', href: '/performance' },
    { label: 'Study Materials', href: '/material' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact Us', href: '/contact' },
  ],
};

// SOCIAL MEDIA LINKS
export const SOCIAL_LINKS = {
  youtube: 'https://youtube.com',
  twitter: 'https://twitter.com',
  facebook: 'https://facebook.com',
  instagram: 'https://instagram.com',
};

interface TestCategory {
  key: string;
  label: string;
}

// EXAM LIBRARY — Filter Categories
export const TEST_CATEGORIES: TestCategory[] = [
  { key: 'all',       label: 'All' },
  { key: 'listening', label: 'Listening' },
  { key: 'reading',   label: 'Reading' },
  { key: 'writing',   label: 'Writing' },
  { key: 'speaking',  label: 'Speaking' },
  { key: 'general',   label: 'General' },
];

interface SortOption {
  value: string;
  label: string;
}

// EXAM LIBRARY — Sort Options
export const SORT_OPTIONS: SortOption[] = [
  { value: 'recent',          label: 'Most Recent' },
  { value: 'difficulty_high', label: 'Difficulty: High to Low' },
  { value: 'difficulty_low',  label: 'Difficulty: Low to High' },
  { value: 'time',            label: 'Estimated Time' },
];

// EXAM LIBRARY — Difficulty ordering for sort
export const DIFFICULTY_ORDER: Record<string, number> = { easy: 1, intermediate: 2, advanced: 3 };

// EXAM LIBRARY — Tests per page
export const TESTS_PER_PAGE = 8;

export type ExamType = 'listening' | 'reading' | 'writing' | 'speaking' | 'general';
export type Difficulty = 'easy' | 'intermediate' | 'advanced';

export interface ExamTest {
  id: string;            // slug, e.g. 'rt-001' — used in URLs
  title: string;
  type: ExamType;
  durationMins: number;
  difficulty: Difficulty;
  totalQuestions: number;
  createdAt: string;
}
