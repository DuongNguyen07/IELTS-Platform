'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import Features from '@/components/sections/Features';
import CTA from '@/components/sections/CTA';
import LoadingState from '@/components/ui/LoadingState';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  // Show loading while checking auth
  if (status === 'loading') {
    return (
      <LoadingState message="Checking authentication..." />
    );
  }

  if (status === 'authenticated') {
    return null;
  }

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
        <CTA />
      </main>
      <Footer />
    </>
  );
}