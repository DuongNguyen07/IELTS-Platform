import Container from 'client/components/layout/Container';
import Card from 'client/components/ui/Card';
import { FEATURES } from "@/constants";
import type { SvgIconComponent } from '@mui/icons-material';

export default function Features() {
  return (
    <section className="w-full bg-gray-50 py-20">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-gray-900 mb-4">
            Everything you need to <br /> achieve your target band score
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our comprehensive platform with expert resources and AI-powered feedback
            is designed to help you excel in all four IELTS sections.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, index) => (
            <Card
              key={index}
              Icon={feature.Icon as SvgIconComponent}
              title={feature.title}
              description={feature.description}
              iconColor={feature.color as 'blue' | 'purple' | 'green' | 'orange' | 'teal' | 'gray'}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
