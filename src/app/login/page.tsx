'use client';

import AuthHero from 'client/components/features/auth/AuthHero';
import LoginForm from 'client/components/features/auth/LoginForm';

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
