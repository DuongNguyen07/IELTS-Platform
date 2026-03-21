import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'social' | 'test';
  size?: 'small' | 'medium' | 'large' | 'social';
  icon?: ReactNode;
  fullWidth?: boolean;
}

export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  size,
  icon = null,
  disabled = false,
  onClick,
  className = '',
  fullWidth = true,
  ...props
}: ButtonProps) {
  const baseStyles = `${fullWidth ? 'w-full' : ''} rounded-lg font-bold transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2`;

  const variants: Record<string, string> = {
    primary: 'bg-blue-600 text-white hover:bg-white hover:text-gray-700 shadow-lg shadow-blue-600/20',
    secondary: 'bg-white text-gray-700 border border-gray-200 hover:bg-blue-600 hover:text-white',
    ghost: 'bg-gray-100 text-gray-900 hover:bg-blue-500',
    outline: 'border-2 border-blue-600/20 bg-transparent text-blue-600 hover:bg-blue-600/5',
    social: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50',
    test: 'bg-teal text-white font-bold text-base px-8 py-4 rounded-xl flex items-center gap-3 hover:opacity-75 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed'
  };

  const sizes: Record<string, string> = {
    small: 'h-10 px-4 text-sm',
    medium: 'h-12 px-6 text-base',
    large: 'h-14 px-8 text-lg',
    social: 'h-11 px-4 text-sm',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant ?? 'primary']} ${size ? sizes[size] : ''} ${className}`}
      {...props}
    >
      {icon && icon}
      {children}
    </button>
  );
}
