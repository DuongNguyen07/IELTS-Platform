import Link from 'next/link';
import Container from 'client/components/layout/Container';
import Button from 'client/components/ui/Button';
export default function CTA() {
  return (
    <section className="w-full py-24">
      <Container>
        <div className="rounded-3xl bg-gradient-to-r from-gray-900 to-blue-900 p-10 md:p-20 text-center relative overflow-hidden">
          {/* Decorative Blurs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-3xl rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/20 blur-3xl rounded-full"></div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center gap-8">
            <h2 className="text-white text-4xl md:text-5xl font-black max-w-2xl">
              Ready to boost your score?
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl">
              Join thousands of students who achieved their dream scores with 
              IELTS Booster. No credit card required to start your journey.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup">
                <Button 
                  variant="primary" 
                  size="large"
                  fullWidth={false}
                >
                  Get Started for Free
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="large"
                fullWidth={false}
                className="bg-white/10 text-white backdrop-blur-sm border border-white/20 hover:bg-white/20"
              >
                Talk to our AI Assistant
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
