'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Container from '@/components/layout/Container';
import WelcomeBanner from '@/components/dashboard/WelcomeBanner';
import ContinueLearning from '@/components/dashboard/ContinueLearning';
import QuickActions from '@/components/dashboard/QuickActions';
import LoadingState from '@/components/ui/LoadingState';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
      setError(null);
      const res = await fetch('/api/user/dashboard');
      if (!res.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      const data = await res.json();
      if (!data.user) {
        throw new Error('Invalid dashboard data');
      }
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setError('Failed to load dashboard. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  const handleRetry = () => {
      setLoading(true);
      setError(null);
      fetchDashboardData();
    };
  // Loading state
  if (loading || status === 'loading') {
    return (
      <LoadingState message="Loading your dashboard..." />
    );
  }
  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  // Not authenticated
  if (!session || !dashboardData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      {/* Main Content */}
      <main className="flex-1">
        <Container>
          <div className="py-10">
            <WelcomeBanner user={dashboardData.user} />
            <ContinueLearning lesson={dashboardData.continueLearning} />
            <QuickActions />
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}