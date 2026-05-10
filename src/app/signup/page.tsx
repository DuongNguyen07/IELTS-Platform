'use client';

import AuthHero from 'client/components/features/auth/AuthHero';
import SignupForm from 'client/components/features/auth/SignUpForm';

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-stretch">
      <AuthHero />
      <div className="w-full lg:w-1/2 flex flex-col bg-white">
        <div className="flex flex-col justify-center items-center min-h-full p-8">
           <SignupForm />
        </div>
      </div>
    </div>
  );
}
