import AuthHero from '@/components/auth/AuthHero';
import SignupForm from '@/components/auth/SignUpForm';

export const metadata = {
  title: 'Sign Up - IELTS Booster',
  description: 'Create your IELTS Booster account',
};

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-stretch bg-gray-50">
      <AuthHero />
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-white">
        <SignupForm />
      </div>
    </div>
  );
}