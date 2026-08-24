import type { Metadata } from 'next'

export const metadata: Metadata = {
  // Root layout template is '%s — Resume Pilot'
  // So 'Workspace' becomes 'Workspace — Resume Pilot' — not double-suffixed
  title: 'Workspace',
  description: 'Analyze your resume with AI.',
  robots: { index: false, follow: false },
}

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return children
}
