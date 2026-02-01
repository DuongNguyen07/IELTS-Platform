'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import Container from '@/components/layout/Container';
import Button from '@/components/ui/Button';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Fetch dashboard data
  useEffect(() => {
    if (status === 'authenticated') {
      fetchDashboardData();
    }
  }, [status]);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/user/dashboard');
      const data = await res.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  // Loading state
  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!session || !dashboardData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <Container size="large">
          <div className="grid grid-cols-3 items-center py-4">
            {/* Logo */}
            <div className="flex items-center gap-3 justify-self-start">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                <span className="text-lg font-bold">📚</span>
              </div>
              <span className="text-xl font-bold text-gray-900">IELTS Booster</span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center justify-center gap-6 lg:gap-8">
              <Link href="/dashboard" className="text-blue-600 text-sm font-semibold flex items-center gap-1.5">
                📊 Dashboard
              </Link>
              <Link href="/exam-library" className="text-gray-600 text-sm font-semibold hover:text-blue-600 transition-colors flex items-center gap-1.5">
                📚 Exam Library
              </Link>
              <Link href="/performance" className="text-gray-600 text-sm font-semibold hover:text-blue-600 transition-colors flex items-center gap-1.5">
                📈 Performance
              </Link>
              <Link href="/material" className="text-gray-600 text-sm font-semibold hover:text-blue-600 transition-colors flex items-center gap-1.5">
                📖 Material
              </Link>
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-4 justify-self-end">
              <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                🔔
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="flex flex-col items-end hidden sm:flex">
                  <span className="text-sm font-bold text-gray-900">
                    {dashboardData.user.name || 'Student'}
                  </span>
                  <span className="text-xs text-teal-500 font-bold uppercase tracking-wider">
                    {dashboardData.user.plan || 'Free Plan'}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-blue-600/20 bg-gradient-to-br from-blue-400 to-purple-400"></div>
              </div>
            </div>
          </div>
        </Container>
      </header>

      {/* Main Content */}
      <main className="max-w-[1200px] mx-auto px-6 lg:px-10 py-10">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-gray-900 text-4xl md:text-5xl font-black tracking-tight mb-2">
            Welcome back, <span className="text-blue-600">{dashboardData.user.name || 'Student'}!</span> 👋
          </h1>
          <p className="text-gray-500 text-lg">
            Your IELTS journey is {dashboardData.user.journeyProgress}% complete. You're doing great!
          </p>
        </div>

        {/* Continue Learning Section */}
        {dashboardData.continueLearning && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gray-900 text-xl font-bold flex items-center gap-2">
                ▶️ Continue Learning
              </h3>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center hover:shadow-xl transition-shadow shadow-sm">
              <div className="w-full md:w-64 aspect-video rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 relative overflow-hidden flex items-center justify-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-4xl text-blue-600">▶️</span>
                </div>
              </div>

              <div className="flex-1">
                <span className="text-teal-500 text-xs font-bold uppercase tracking-wider mb-2 block">
                  ✍️ {dashboardData.continueLearning.moduleType.toUpperCase()} MODULE
                </span>
                <h4 className="text-gray-900 text-2xl font-bold mb-4">
                  {dashboardData.continueLearning.lessonTitle}
                </h4>
                
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">{dashboardData.continueLearning.progressPercent}% Complete</span>
                    <span className="text-gray-600">{dashboardData.continueLearning.timeRemaining} mins remaining</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${dashboardData.continueLearning.progressPercent}%` }}
                    ></div>
                  </div>
                </div>

                <Button variant="primary" size="large" fullWidth={false}>
                  Resume Lesson →
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* Kickstart Your Practice Section */}
        <section className="mb-12">
          <h3 className="text-gray-900 text-xl font-bold flex items-center gap-2 mb-6">
            🚀 Kickstart Your Practice
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h4 className="text-gray-900 text-lg font-bold mb-2">
                Take a Diagnostic Test
              </h4>
              <p className="text-gray-600 text-sm mb-4">
                Identify your strengths and weaknesses across all four sections.
              </p>
              <Link href="#" className="text-blue-600 font-semibold text-sm hover:underline">
                Start Test →
              </Link>
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h4 className="text-gray-900 text-lg font-bold mb-2">
                Browse Study Materials
              </h4>
              <p className="text-gray-600 text-sm mb-4">
                Access curated PDFs, video lessons, and vocabulary cheat sheets.
              </p>
              <Link href="#" className="text-teal-500 font-semibold text-sm hover:underline">
                View Library →
              </Link>
            </div>

            {/* Card 3 */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🏁</span>
              </div>
              <h4 className="text-gray-900 text-lg font-bold mb-2">
                Set a Study Goal
              </h4>
              <p className="text-gray-600 text-sm mb-4">
                Define your target band score and get a personalized timeline.
              </p>
              <Link href="#" className="text-gray-900 font-semibold text-sm hover:underline">
                Create Goal →
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <Container>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">📚</span>
              <span className="font-bold text-gray-900">IELTS Booster</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-600">
              <Link href="#" className="hover:text-blue-600">Help Center</Link>
              <Link href="#" className="hover:text-blue-600">Privacy Policy</Link>
              <Link href="#" className="hover:text-blue-600">Terms of Service</Link>
              <button onClick={handleLogout} className="hover:text-red-600">Logout</button>
            </div>
            <p className="text-sm text-gray-500">
              © 2024 IELTS Booster. Ready for Band 8.0?
            </p>
          </div>
        </Container>
      </footer>
    </div>
  );
}