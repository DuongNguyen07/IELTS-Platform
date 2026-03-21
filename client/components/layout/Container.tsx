import type { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: 'small' | 'default' | 'large';
}

export default function Container({
  children,
  className = '',
  size = 'default',
}: ContainerProps) {
  const sizes: Record<string, string> = {
    small: 'max-w-4xl',
    default: 'max-w-7xl',
    large: 'max-w-[1400px]',
  };
  return (
    <div className={`${sizes[size]} mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}
