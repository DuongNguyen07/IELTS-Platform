import Container from "../layout/Container";
import Card from "../ui/Card";
import { FEATURES } from "@/lib/constants"; 

export default function Features() {
    return (
        <section className="w-full bg-gray-100 py-20">
            <Container>
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black text-gray-900 mb-4">
                        Everything you need to <br /> achieve your target band score
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Our comprehensive platform for self-practice with redundant expert resources and AI-powered feedback is designed to help you excel in all four IELTS sections: Listening, Reading, Writing, and Speaking.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {FEATURES.map((feature, index) => (
                        <Card 
                        key={index} 
                        Icon={feature.icon} 
                        title={feature.title} 
                        description={feature.description}
                        iconColor={feature.iconColor}
                        />
                    ))}
                </div>
            </Container>
        </section>
    );
}