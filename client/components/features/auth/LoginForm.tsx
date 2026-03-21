'use client';
import { signIn } from 'next-auth/react';
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Button from 'client/components/ui/Button';
import Input from 'client/components/ui/Input';
import PasswordInput from 'client/components/ui/PasswordInput';
import Alert from 'client/components/ui/Alert';
import SocialLogin from 'client/components/features/auth/SocialLogin';

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
        setLoading(false);
        return;
      }

      router.push('/');
      router.refresh();
    } catch (error) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Mobile Logo */}
      <div className="lg:hidden flex items-center gap-2 mb-8">
        <div className="w-8 h-8 bg-blue-200 rounded-lg flex items-center justify-center text-white">
          <span> <Image src="/images/logo-icon.png" alt="IELTS Booster Logo" width={20} height={20} /></span>
        </div>
        <h2 className="text-xl font-bold text-gray-900">IELTS Booster</h2>
      </div>

      {/* Page Heading */}
      <div className="flex flex-col gap-2">
        <h2 className="text-gray-900 text-3xl font-bold leading-tight">Welcome back</h2>
        <p className="text-gray-500 text-sm font-normal">
          Please enter your details to continue your learning journey.
        </p>
      </div>

      {/* Error Message */}
      {error && <Alert message={error} type="error" />}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email address"
          required
        />

        <PasswordInput
          label="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          showToggle={true}
        />
        {/* Keep Me Logged In Checkbox & Forgot Password Pattern */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-600 w-4 h-4"
            />
            <span className="text-sm text-gray-600 font-medium">Keep me logged in</span>
          </label>
          <Link href="#" className="text-sm font-bold text-blue-600 hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" variant="primary" size="medium" disabled={loading}>
          {loading ? 'Signing in...' : 'Login'}
        </Button>
      </form>

      <SocialLogin />

      {/* Footer */}
      <p className="text-center text-sm text-gray-500">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-blue-600 font-bold hover:underline">
          Sign up for free
        </Link>
      </p>
    </div>
  );
}
