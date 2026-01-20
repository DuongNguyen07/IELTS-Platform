import './globals.css'

export const metadata = {
  title: 'IELTS Boost - AI-Powered IELTS Practice Platform',
  description: 'Master IELTS with AI-powered practice and instant feedback',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}