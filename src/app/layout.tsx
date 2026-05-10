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
        <div className="bg-orb bg-orb-1" aria-hidden="true" />
        <div className="bg-orb bg-orb-2" aria-hidden="true" />
        <div className="bg-orb bg-orb-3" aria-hidden="true" />
        <div className="bg-orb bg-orb-4" aria-hidden="true" />
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
