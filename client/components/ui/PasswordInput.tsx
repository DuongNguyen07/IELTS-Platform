'use client';

import { useState, type ChangeEvent } from 'react';
import Image from 'next/image';

interface PasswordInputProps {
  label?: string;
  name?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string | null;
  showToggle?: boolean;
}

export default function PasswordInput({
  label,
  name,
  value,
  onChange,
  placeholder = 'Enter your password',
  required = false,
  error = null,
  showToggle = true,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-semibold text-gray-900 leading-normal">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`flex w-full rounded-lg text-gray-900 border ${
            error ? 'border-red-500' : 'border-gray-200'
          } bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 h-12 px-4 ${
            showToggle ? 'pr-12' : ''
          } text-base transition-colors outline-none`}
        />

        {showToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? (
              <Image
                src="/images/eye-open.png"
                alt="Hide Password"
                width={20}
                height={20}
              />
            ) : (
              <Image
                src="/images/eye-closed.png"
                alt="Show Password"
                width={20}
                height={20}
              />
            )}
          </button>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
}
