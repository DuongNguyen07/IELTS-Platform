import './globals.css';
import ClientProviders from '@/components/providers/ClientProviders';

export const metadata = {
  title: 'IELTS Booster',
  description: 'Master the IELTS with Confidence',
};

export default function RootLayout({ children }) {
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