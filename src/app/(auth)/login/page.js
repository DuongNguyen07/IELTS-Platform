import AuthHero from '@/components/auth/AuthHero.jsx';
import LoginForm from '@/components/auth/LoginForm.jsx';

export const metadata = {
  title: 'Login - IELTS Booster',
  description: 'Sign in to your IELTS Booster account',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-stretch bg-gray-50">
      <AuthHero />
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-white">
        <LoginForm />
      </div>
    </div>
  );
}