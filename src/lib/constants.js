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

// NAVIGATION LINKS (Authenticated Users)
export const AUTH_NAV_LINKS = [
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

// USER MENU OPTIONS (Desktop Dropdown & Mobile Version)
export const USER_MENU_OPTIONS = [
  {
    href: '/profile',
    label: 'Profile',
    Icon: PersonIcon,
    description: 'Manage your account settings',
  },
  {
    href: '/settings',
    label: 'Settings',
    Icon: SettingsIcon,
    description: 'Configure your preferences',
  },
  {
    href: '/notifications',
    label: 'Notifications',
    Icon: NotificationsIcon,
    description: 'View your notifications',
  },
];

// LOGOUT ACTION
export const LOGOUT_ACTION = {
  label: 'Logout',
  Icon: LogoutIcon,
  description: 'Sign out of your account',
};

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

// QUICK ACTIONS (Dashboard Cards)
export const QUICK_ACTIONS = [
  {
    Icon: AssignmentTurnedInIcon,
    title: 'Take a Diagnostic Test',
    description: 'Identify your strengths and weaknesses across all four sections.',
    link: '/diagnostic-test',
    linkText: 'Start Test →',
    colorClass: 'bg-blue-100 text-blue-600',
    linkColor: 'text-blue-600',
  },
  {
    Icon: LibraryBooksIcon,
    title: 'Browse Study Materials',
    description: 'Access curated PDFs, video lessons, and vocabulary cheat sheets.',
    link: '/materials',
    linkText: 'View Library →',
    colorClass: 'bg-teal-100 text-teal-600',
    linkColor: 'text-teal-500',
  },
  {
    Icon: FlagIcon,
    title: 'Set a Study Goal',
    description: 'Define your target band score and get a personalized timeline.',
    link: '/goals',
    linkText: 'Create Goal →',
    colorClass: 'bg-gray-100 text-gray-600',
    linkColor: 'text-gray-900',
  },
];

// FEATURES (Landing Page)
export const FEATURES = [
  {
    icon: 'assignment_turned_in',
    title: 'Simulated Exams',
    description: 'Realistic practice tests that mimic the actual IELTS environment.',
    color: 'blue',
  },
  {
    icon: 'auto_graph',
    title: 'AI-Powered Scoring',
    description: 'Get instant feedback on your writing and speaking with advanced AI analysis.',
    color: 'purple',
  },
  {
    icon: 'insights',
    title: 'Performance Analytics',
    description: 'Track your progress with detailed insights and identify areas for improvement.',
    color: 'green',
  },
  {
    icon: 'school',
    title: 'Expert Resources',
    description: 'Access curated study materials, tips, and strategies from IELTS experts.',
    color: 'orange',
  },
];

// FOOTER LINKS
export const FOOTER_LINKS = {
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