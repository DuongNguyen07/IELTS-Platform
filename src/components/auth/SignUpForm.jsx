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
import { ca } from 'zod/v4/locales';

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
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    number: false,
    special: false,
  });

  // Password validation function (checks length >= 8, contains number and special char)
  const validatePassword = (password) => {
    return {
      length: password.length >= 8,
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setFormData({ ...formData, password: newPassword });
    setPasswordStrength(validatePassword(newPassword));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

  const getPasswordError = () => {
    if (!passwordStrength.length) return 'Password must be at least 8 characters long';
    if (!passwordStrength.number) return 'Password must contain at least 1 number';
    if (!passwordStrength.special) return 'Password must contain at least 1 special character';
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
    return null;
    };
    const errorMessage = getPasswordError();
    if (errorMessage) {
    setError(errorMessage);
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
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
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
              
              <div className="flex items-center gap-2">
                <span className={`text-xs ${passwordStrength.length ? 'text-green-600' : 'text-gray-400'}`}>
                  {passwordStrength.length ? <CheckCircleIcon fontSize="small" /> : <CheckCircleOutline fontSize="small" />}
                </span>
                <span className={`text-xs ${passwordStrength.length ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                  At least 8 characters
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-xs ${passwordStrength.number ? 'text-green-600' : 'text-gray-400'}`}>
                  {passwordStrength.number ? <CheckCircleIcon fontSize="small" /> : <CheckCircleOutline fontSize="small" />}
                </span>
                <span className={`text-xs ${passwordStrength.number ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                  At least 1 number
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-xs ${passwordStrength.special ? 'text-green-600' : 'text-gray-400'}`}>
                  {passwordStrength.special ? <CheckCircleIcon fontSize="small" /> : <CheckCircleOutline fontSize="small" />}
                </span>
                <span className={`text-xs ${passwordStrength.special ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                  At least 1 special character (!@#$%...)
                </span>
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

        <Button type="submit" variant="primary" disabled={loading}>
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