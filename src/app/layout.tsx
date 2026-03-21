import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '@/client/styles/globals.css';
import ClientProviders from '@/components/providers/ClientProviders';

export const metadata: Metadata = {
  title: 'IELTS Booster',
  description: 'Master the IELTS with Confidence',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
