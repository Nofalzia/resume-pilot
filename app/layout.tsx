import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://ai-resume-pilot-nz.vercel.app'),
  title: {
    default: 'Resume Pilot — AI-powered resume analysis',
    template: '%s — Resume Pilot',
  },
  description:
    'Analyze your resume against any job description. Get AI-powered feedback on ATS compatibility, missing keywords, experience bullet impact, and exactly what to fix first.',
  keywords: [
    'resume analysis',
    'AI resume feedback',
    'ATS checker',
    'resume optimization',
    'keyword gap analysis',
    'resume score',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ai-resume-pilot-nz.vercel.app',
    siteName: 'Resume Pilot',
    title: 'Resume Pilot — AI-powered resume analysis',
    description:
      'Paste your resume. Add a target job. Get structured AI feedback on keywords, ATS compatibility, and exactly what to improve.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Resume Pilot' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Resume Pilot — AI-powered resume analysis',
    description:
      'Paste your resume. Add a target job. Get structured AI feedback on keywords, ATS compatibility, and exactly what to improve.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
