import type { Metadata } from 'next'

export const metadata: Metadata = {
  // The root template appends “— Resume Pilot”.
  title: 'Workspace',
  description: 'Analyze your resume with AI.',
  robots: { index: false, follow: false },
}

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return children
}
