import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import PsychologyIcon from '@mui/icons-material/Psychology';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LegendToggleIcon from '@mui/icons-material/LegendToggle';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
// Brand configuration
export const BRAND = {
  name: 'IELTS Booster',
  tagline: 'Master the IELTS with Confidence',
  description: 'AI-powered IELTS practice platform',
};

// Color system
export const COLORS = {
  primary: '#2b6cee',
  navy: '#0d121b',
  tealAccent: '#14b8a6',
};

// Navigation links
export const NAV_LINKS = [
  { href: '/dashboard', label: 'Dashboard', icon: DashboardIcon },
  { href: '/exam-library', label: 'Exam Library', icon: MenuBookIcon },
  { href: '/performance', label: 'Performance', icon: LegendToggleIcon },
  { href: '/material', label: 'Material', icon: FolderOpenIcon },
];

// Features
export const FEATURES = [
  {
    icon: AssignmentTurnedInIcon,
    title: 'Simulated Exams',
    description: 'Realistic practice tests that mimic the actual IELTS environment, including timed writing and listening.',
    color: 'blue',
  },
  {
    icon: PsychologyIcon,
    title: 'AI-Driven Feedback',
    description: 'Instant, data-backed insights on writing and speaking tasks with vocabulary suggestions and grammar fixes.',
    color: 'teal',
  },
  {
    icon: LibraryBooksIcon,
    title: 'Comprehensive Library',
    description: 'A vast repository of videos, practice sets, and grammar guides updated monthly for the newest formats.',
    color: 'teal',
  },
];


// Footer links
export const FOOTER_LINKS = {
  platform: [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Exam Library', href: '/exam-library' },
    { label: 'Performance', href: '/performance' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'FAQ', href: '/faq' },
  ],
};