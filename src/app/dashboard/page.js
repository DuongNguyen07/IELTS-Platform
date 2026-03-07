'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from 'client/components/layout/Header';
import Footer from 'client/components/layout/Footer';
import Container from 'client/components/layout/Container';
import WelcomeBanner from 'client/components/features/dashboard/WelcomeBanner';
import ContinueLearning from 'client/components/features/dashboard/ContinueLearning';
import QuickActions from 'client/components/features/dashboard/QuickActions';
import LoadingState from 'client/components/ui/LoadingState';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Fetch dashboard data once session is ready
  useEffect(() => {
    if (status === 'authenticated' && !dashboardData && !fetching) {
      fetchDashboardData();
    }
  }, [status]);

  const fetchDashboardData = async () => {
    try {
      setFetching(true);
      setError(null);
      const res = await fetch('/api/user/dashboard');
      if (!res.ok) throw new Error('Failed to fetch dashboard data');
      const data = await res.json();
      if (!data.user) throw new Error('Invalid dashboard data');
      setDashboardData(data);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError('Failed to load dashboard. Please try again.');
    } finally {
      setFetching(false);
    }
  };

  if (status === 'loading') {
    return <LoadingState message="Loading your dashboard..." />;
  }

  if (status === 'unauthenticated') return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1">
        <Container>
          <div className="py-10">
            {error ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <p className="text-red-600">{error}</p>
                <button
                  onClick={fetchDashboardData}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                >
                  Retry
                </button>
              </div>
            ) : fetching || !dashboardData ? (
              <div className="flex items-center justify-center py-24">
                <LoadingState message="Loading your dashboard..." />
              </div>
            ) : (
              <>
                <WelcomeBanner user={dashboardData.user} />
                <ContinueLearning lesson={dashboardData.continueLearning} />
                <QuickActions />
              </>
            )}
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}