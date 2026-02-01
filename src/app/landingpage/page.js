import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import Features from '@/components/sections/Features';
import CTA from '@/components/sections/CTA';

export const metadata = {
  title: 'IELTS Booster - Master the IELTS with Confidence',
  description: 'AI-powered IELTS practice platform with personalized study plans and real-time feedback',
};

export default function HomePage() {
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