'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Button from 'client/components/ui/Button';
import Input from 'client/components/ui/Input';
import PasswordInput from 'client/components/ui/PasswordInput';
import Alert from 'client/components/ui/Alert';
import SocialLogin from 'client/components/features/auth/SocialLogin';
import { ICONS } from '@/constants';

interface PasswordStrength {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
}

// Add missing validation function
function checkPasswordStrength(password: string): PasswordStrength {
  return {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
}

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

function validateSignupForm(formData: FormData): FormErrors | null {
  const errors: FormErrors = {};

  if (!formData.name || formData.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!formData.email || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  const strength = checkPasswordStrength(formData.password);
  if (!strength.length || !strength.uppercase || !strength.lowercase || !strength.number || !strength.special) {
    errors.password = 'Password does not meet all requirements';
  }

  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return Object.keys(errors).length > 0 ? errors : null;
}

export default function SignupForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setFormData({ ...formData, password: newPassword });
    setPasswordStrength(checkPasswordStrength(newPassword));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const validationErrors = validateSignupForm(formData);
    if (validationErrors) {
      const firstError = Object.values(validationErrors)[0];
      setError(firstError as string);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Something went wrong');
        setLoading(false);
        return;
      }

      router.push('/login?registered=true');
    } catch (error) {
      console.error('Signup error:', error);
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
        <div className="w-8 h-8 bg-blue-200 rounded-lg flex items-center justify-center">
          <Image
            src="/images/logo-icon.png"
            alt="IELTS Booster Logo"
            width={20}
            height={20}
          />
        </div>
        <h2 className="text-xl font-bold text-gray-900">IELTS Booster</h2>
      </div>

      {/* Page Heading */}
      <div className="flex flex-col gap-2">
        <h2 className="text-gray-900 text-3xl font-bold leading-tight">
          Create Your Account
        </h2>
        <p className="text-gray-500 text-sm font-normal">
          Start your journey to a high IELTS score today
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert message={error} type="error" />
      )}

      {/* Signup Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Full Name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your full name"
          required
        />

        <Input
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          required
        />

        <div className="space-y-2">
          <PasswordInput
            label="Password"
            name="password"
            value={formData.password}
            onChange={handlePasswordChange}
            placeholder="Create a password"
            required
            showToggle={true}
          />

          {formData.password && (
            <div className="mt-3 bg-gray-50 p-3 rounded-lg">
              <p className="text-xs font-semibold text-gray-700 mb-2">
                Password Requirements:
              </p>
              <div className="space-y-1">
                <PasswordRequirement
                  met={passwordStrength.length}
                  text="At least 8 characters"
                />
                <PasswordRequirement
                  met={passwordStrength.uppercase}
                  text="At least 1 uppercase letter (A-Z)"
                />
                <PasswordRequirement
                  met={passwordStrength.lowercase}
                  text="At least 1 lowercase letter (a-z)"
                />
                <PasswordRequirement
                  met={passwordStrength.number}
                  text="At least 1 number (0-9)"
                />
                <PasswordRequirement
                  met={passwordStrength.special}
                  text="At least 1 special character (!@#$%...)"
                />
              </div>
            </div>
          )}
        </div>

        <PasswordInput
          label="Confirm Password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Re-enter your password"
          required
          showToggle={true}
        />

        <div>
          <label className="flex items-start gap-2 text-gray-600 text-sm cursor-pointer">
            <input
              type="checkbox"
              required
              className="w-4 h-4 mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
            />
            <span>
              By signing up, I agree to the{' '}
              <Link href="/terms" className="text-blue-600 font-semibold hover:underline">
                Terms of Service
              </Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-blue-600 font-semibold hover:underline">
                Privacy Policy
              </Link>
            </span>
          </label>
        </div>

        <Button type="submit" variant="primary" size="medium" disabled={loading}>
          {loading ? 'Creating account...' : 'Sign up for free'}
        </Button>
      </form>

      <SocialLogin />

      <p className="text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-600 font-bold hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}

interface PasswordRequirementProps {
  met: boolean;
  text: string;
}

function PasswordRequirement({ met, text }: PasswordRequirementProps) {
  return (
    <div className="flex items-center gap-2">
      {met ? (
        <ICONS.check fontSize="small" className="text-green-600" />
      ) : (
        <ICONS.checkOutline fontSize="small" className="text-gray-400" />
      )}
      <span className={`text-xs ${met ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
        {text}
      </span>
    </div>
  );
}
