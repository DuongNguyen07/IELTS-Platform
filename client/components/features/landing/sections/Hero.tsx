import Link from "next/link";
import Container from 'client/components/layout/Container';
import Button from "@/components/ui/Button";
import { ICONS } from "@/constants";

export default function Hero() {
  return (
    <section className="w-full py-12 md:py-24">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <span className="inline-flex items-center gap-2 font-semibold text-sm uppercase tracking-widest" style={{ color: '#14b8a6' }}>
                <ICONS.autoAwesome style={{ color: '#14b8a6' }} />
                AI-Powered Learning
              </span>
              <h1 className="text-gray-900 text-5xl md:text-6xl font-black leading-tight">
                Master the IELTS with{' '}
                <span className="text-blue-600">Confidence</span>
              </h1>
              <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-screen-md">
                Unlock your potential with personalized study plans, realtime AI-feedback and expert-led resources designed to help you achieve your target IELTS score.
              </p>
            </div>
            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup" className="flex">
                <Button variant="primary" size="large" fullWidth={false}>
                  Sign up for free
                </Button>
              </Link>
              <Button variant="secondary" size="large" fullWidth={false}>
                Watch Demo
              </Button>
            </div>
          </div>
          {/*Right Demo Video*/}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-gray-200 shadow-2xl bg-gradient-to-br from-blue-100 to-teal-100">
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center p-8">
                <div className="text-6xl mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Demo Video
                    <p className="text-gray-600">
                      Coming Soon!
                    </p>
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
