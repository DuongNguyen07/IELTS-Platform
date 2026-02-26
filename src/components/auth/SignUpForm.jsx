'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Alert from '@/components/ui/Alert';
import SocialLogin from '@/components/auth/SocialLogin';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import Image from 'next/image';
import PasswordInput from '@/components/ui/PasswordInput';
import { checkPasswordStrength, validateSignupForm } from '@/lib/validation'; // ← IMPORT SHARED

export default function SignupForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    number: false,
    special: false,
    uppercase: false,
  });

  // Use shared validation function
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setFormData({ ...formData, password: newPassword });
    setPasswordStrength(checkPasswordStrength(newPassword)); // ← SHARED FUNCTION
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validation using shared function
    const validationErrors = validateSignupForm(formData); // ← SHARED FUNCTION
    if (validationErrors) {
      // Show first error
      const firstError = Object.values(validationErrors)[0];
      setError(firstError);
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

      let data;
      try {
        data = await response.json();
      } catch {
        data = {};  
      }

      if (!response.ok) {
        setError(data.error || 'Something went wrong');
        setLoading(false);
        return;
      }

      // Redirect to login after successful signup
      router.push('/login?registered=true');
    } catch (error) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
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
          <span>
            <Image src="/images/logo-icon.png" alt="IELTS Booster Logo" width={20} height={20} />
          </span>
        </div>
        <h2 className="text-xl font-bold text-gray-900">IELTS Booster</h2>
      </div>

      {/* Page Heading */}
      <div className="flex flex-col gap-2">
        <h2 className="text-gray-900 text-3xl font-bold leading-tight">Create Your Account</h2>
        <p className="text-gray-500 text-sm font-normal">
          Start your journey to a high IELTS score today
        </p>
      </div>

      {/* Error Message */}
      {error && <Alert message={error} type="error" />}

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

        {/* Password with Strength Indicator */}
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
          
          {/* Password Strength Checklist */}
          {formData.password && (
            <div className="mt-3 bg-gray-50 p-3 rounded-lg">
              <p className="text-xs font-semibold text-gray-700 mb-2">Password Requirements:</p>
              
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

        {/* Terms Checkbox */}
        <div>
          <label className="flex items-start gap-2 text-gray-600 text-sm cursor-pointer">
            <input 
              type="checkbox" 
              required
              className="w-4 h-4 mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-600 cursor-pointer" 
            />
            <span>
              By signing up, I agree to the{' '}
              <Link href="#" className="text-blue-600 font-semibold hover:underline">
                Terms of Service
              </Link>
              {' '}and{' '}
              <Link href="#" className="text-blue-600 font-semibold hover:underline">
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

      {/* Footer */}
      <p className="text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-600 font-bold hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}

function PasswordRequirement({ met, text }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`text-xs ${met ? 'text-green-600' : 'text-gray-400'}`}>
        {met ? <CheckCircleIcon fontSize="small" /> : <CheckCircleOutline fontSize="small" />}
      </span>
      <span className={`text-xs ${met ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
        {text}
      </span>
    </div>
  );
}