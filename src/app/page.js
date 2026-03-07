import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "server/config/auth";
import Header from 'client/components/layout/Header';
import Footer from 'client/components/layout/Footer';
import Hero from '@/components/features/landing/sections/Hero';
import Features from '@/components/features/landing/sections/Features';
import CTA from '@/components/features/landing/sections/CTA';

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/dashboard");
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