import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "server/config/auth";
import Header from 'client/components/layout/Header';
import Footer from 'client/components/layout/Footer';
import Hero from '@/components/features/landing/sections/Hero';
import Features from '@/components/features/landing/sections/Features';
import CTA from '@/components/features/landing/sections/CTA';
import Container from 'client/components/layout/Container';
import WelcomeBanner from '@/components/features/WelcomePage/WelcomeBanner';
import ContinueLearning from '@/components/features/WelcomePage/ContinueLearning';
import QuickActions from '@/components/features/WelcomePage/QuickActions';
import prisma from 'server/lib/prisma';

async function getHomeData(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      progress: {
        where: { status: 'in_progress' },
        orderBy: { lastAccessed: 'desc' },
        take: 1,
      },
    },
  });

  return {
    user: {
      name: user?.name,
      journeyProgress: 0,
    },
    continueLearning: (user?.progress[0] ?? null) as {
      id: string;
      moduleType?: string;
      lessonTitle?: string;
      progressPercent?: number;
      timeRemaining?: number;
      lessonId?: string;
    } | null,
  };
}

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role === "admin") {
    redirect("/admin/exams");
  }

  if (!session?.user) {
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

  const homeData = await getHomeData(session.user.id);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Container>
          <div className="py-10">
            <WelcomeBanner user={homeData.user} />
            <ContinueLearning lesson={homeData.continueLearning} />
            <QuickActions />
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
